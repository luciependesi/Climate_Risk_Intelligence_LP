# backend/app/api/devices.py
#Endpoint
# Post /api/devices/register
# app/api/devices.py

import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.db.session import get_db
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceOut
from pydantic import BaseModel

router = APIRouter(prefix="/devices", tags=["devices"])


# ---------------------------------------------------------
# POST /api/devices/register  (kept exactly as you had it)
# ---------------------------------------------------------
@router.post("/register", response_model=DeviceOut)
async def register_device(payload: DeviceCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(Device).where(Device.id == payload.id)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device already registered",
        )

    api_key = secrets.token_hex(16)

    device = Device(
        id=payload.id,
        name=payload.name,
        api_key=api_key,
        is_active=True,
    )

    db.add(device)
    await db.commit()
    await db.refresh(device)

    return device


# ---------------------------------------------------------
# GET /api/devices  (with online/offline status)
# ---------------------------------------------------------
@router.get("", response_model=list[DeviceOut])
async def list_devices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        text("""
            SELECT
                device_id AS id,
                api_key,
                is_active,
                latitude,
                longitude,
                last_seen,
                registered_at,
                name,
                firmware_ver,
                location_hint,
                (now() - last_seen < interval '5 minutes') AS is_online
            FROM devices
            ORDER BY device_id
        """)
    )
    rows = result.mappings().all()
    return rows


# ---------------------------------------------------------
# GET /api/devices/{device_id}
# ---------------------------------------------------------
@router.get("/{device_id}", response_model=DeviceOut)
async def get_device(device_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        text("""
            SELECT
                device_id AS id,
                api_key,
                is_active,
                latitude,
                longitude,
                last_seen,
                registered_at,
                name,
                firmware_ver,
                location_hint,
                (now() - last_seen < interval '5 minutes') AS is_online
            FROM devices
            WHERE device_id = :device_id
        """),
        {"device_id": device_id},
    )
    row = result.mappings().first()

    if not row:
        raise HTTPException(status_code=404, detail="Device not found")

    return row


# ---------------------------------------------------------
# PATCH /api/devices/{device_id}
# rename / deactivate / firmware update / location update
# ---------------------------------------------------------
class DeviceUpdate(BaseModel):
    name: str | None = None
    is_active: int | None = None
    firmware_ver: str | None = None
    location_hint: str | None = None


@router.patch("/{device_id}")
async def update_device(
    device_id: int,
    payload: DeviceUpdate,
    db: AsyncSession = Depends(get_db),
):
    fields = []
    params = {"device_id": device_id}

    if payload.name is not None:
        fields.append("name = :name")
        params["name"] = payload.name

    if payload.is_active is not None:
        fields.append("is_active = :is_active")
        params["is_active"] = payload.is_active

    if payload.firmware_ver is not None:
        fields.append("firmware_ver = :firmware_ver")
        params["firmware_ver"] = payload.firmware_ver

    if payload.location_hint is not None:
        fields.append("location_hint = :location_hint")
        params["location_hint"] = payload.location_hint

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    query = f"""
        UPDATE devices
        SET {", ".join(fields)}
        WHERE device_id = :device_id
    """

    result = await db.execute(text(query), params)
    await db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Device not found")

    return {"status": "ok"}