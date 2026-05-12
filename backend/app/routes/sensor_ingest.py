# © 2026 Lucie Pendesi. All rights reserved.
# Licensed under the MIT License. See the LICENSE file for details.
# backend/app/routes/sensor_ingest.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from ..schemas.devices_reading import DeviceReadingIn

router = APIRouter(prefix="/sensor", tags=["sensor"])


@router.post("/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_sensor_reading(
    payload: DeviceReadingIn,
    db: AsyncSession = Depends(get_db),
):
    # 1) Ensure device exists
    result = await db.execute(
        select(Device).where(Device.id == payload.device_id)
    )
    device = result.scalar_one_or_none()

    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device {payload.device_id} not registered",
        )

    # 2) Insert reading
    reading = SensorReading(
        device_id=payload.device_id,
        timestamp_ms=payload.timestamp_ms,
        temperature_c=payload.temperature_c,
        humidity_pct=payload.humidity_pct,
        pressure_hpa=payload.pressure_hpa,
        mq135_ppm=payload.mq135_ppm,
        water_level=payload.water_level,
        rain_intensity=payload.rain_intensity,
        battery_v=payload.battery_v,
        latitude=payload.latitude,
        longitude=payload.longitude,
        is_virtual=payload.is_virtual,
    )
    db.add(reading)

    # 3) Update device last_seen + is_virtual
    device.last_seen_ms = payload.timestamp_ms
    device.is_virtual = payload.is_virtual

    await db.commit()
    await db.refresh(reading)

    return {"status": "ok", "id": reading.id}