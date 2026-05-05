# app/api/risk.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.db.session import get_db
from app.models.sensor_reading import SensorReading
from app.core.risk import compute_risk, compute_confidence

router = APIRouter(
    prefix="/risk",
    tags=["risk"]
)

@router.get("/latest")
async def get_latest_risk(device_id: str, db: AsyncSession = Depends(get_db)):
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

    score = compute_risk(reading)
    confidence = compute_confidence(reading)

    return {
        "device_id": device_id,
        "risk_score": score,
        "confidence": confidence
    }

@router.get("/readings/risk/{device_id}")
async def get_risk(device_id: str, db: AsyncSession = Depends(get_db)):
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

    score = compute_risk(reading)
    confidence = compute_confidence(reading)

    return [{"risk": score, "confidence": confidence}]