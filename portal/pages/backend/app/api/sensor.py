# frontend‑friendly JSON endpoints
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, text
from typing import List

from app.db.session import get_db
from app.models.sensor_reading import SensorReading
from app.schemas.sensor_reading import SensorReadingOut
from app.core.risk import compute_risk
from app.core.risk import compute_confidence

router = APIRouter(
    prefix="/sensor",
    tags=["sensor"]
)

# ---------------------------------------------------------
# /sensor/latest
# ---------------------------------------------------------
@router.get("/latest", response_model=SensorReadingOut)
async def get_latest_sensor_reading(
    device_id: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(SensorReading)
        .where(SensorReading.device_id == device_id)
        .order_by(desc(SensorReading.timestamp_ms))
        .limit(1)
    )

    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()

    if not obj:
        raise HTTPException(status_code=404, detail="No readings found for device")

    return obj


# ---------------------------------------------------------
# /sensor/history  (correct path)
# ---------------------------------------------------------
@router.get("/history", response_model=List[SensorReadingOut])
async def get_sensor_history(
    device_id: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    query = text("""
        SELECT *
        FROM iot_readings
        WHERE device_id = :device_id
        ORDER BY timestamp_ms DESC
        LIMIT :limit
    """)

    result = await db.execute({"device_id": device_id, "limit": limit})
    rows = result.mappings().all()

    return [dict(r) for r in rows]


# ---------------------------------------------------------
# /sensor/risk_score
# ---------------------------------------------------------
@router.get("/risk_score")
async def get_risk_score(
    device_id: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(SensorReading)
        .where(SensorReading.device_id == device_id)
        .order_by(desc(SensorReading.timestamp_ms))
        .limit(1)
    )
    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="No readings for device")

    score = compute_risk(obj)
    return {"device_id": device_id, "risk_score": score}


# ---------------------------------------------------------
# /sensor/confidence
# ---------------------------------------------------------
@router.get("/confidence")
async def get_confidence(device_id: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(SensorReading)
        .where(SensorReading.device_id == device_id)
        .order_by(desc(SensorReading.timestamp_ms))
        .limit(1)
    )
    result = await db.execute(stmt)
    reading = result.scalar_one_or_none()
    if not reading:
        raise HTTPException(status_code=404, detail="No readings for device")

    cci = compute_confidence(reading)
    return {"device_id": device_id, "confidence": cci}