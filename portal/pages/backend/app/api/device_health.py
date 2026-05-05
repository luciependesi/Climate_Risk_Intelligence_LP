from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from typing import List, Dict, Any

from app.db.session import get_db
from app.models.device import Device

router = APIRouter(prefix="/devices", tags=["devices"])

ONLINE_THRESHOLD_MS = 5 * 60 * 1000  # 5 minutes


def _now_ms() -> int:
    return int(datetime.now(tz=timezone.utc).timestamp() * 1000)


def _device_status(device: Device) -> Dict[str, Any]:
    now_ms = _now_ms()
    last_seen_ms = device.last_seen_ms or 0
    delta = now_ms - last_seen_ms
    is_online = delta <= ONLINE_THRESHOLD_MS

    return {
        "device_id": device.id,
        "name": device.name,
        "is_online": is_online,
        "last_seen_ms": last_seen_ms,
        "last_seen_iso": (
            datetime.fromtimestamp(last_seen_ms / 1000, tz=timezone.utc).isoformat()
            if last_seen_ms
            else None
        ),
        "is_virtual": device.is_virtual,
        "offline_for_ms": max(delta, 0),
    }


@router.get("/{device_id}/health")
async def get_device_health(
    device_id: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    result = await db.execute(select(Device).where(Device.id == device_id))
    device = result.scalar_one_or_none()

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")

    return _device_status(device)


@router.get("/health")
async def list_device_health(
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    result = await db.execute(select(Device))
    devices = result.scalars().all()
    return [_device_status(d) for d in devices]