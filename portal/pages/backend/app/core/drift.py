# Drift detection module + endpoint + UI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.sensor_reading import SensorReading

async def compute_drift(db: AsyncSession, device_id: str, window: int = 100):
    stmt = (
        select(SensorReading)
        .where(SensorReading.device_id == device_id)
        .order_by(desc(SensorReading.received_at))
        .limit(window)
    )
    result = await db.execute(stmt)
    rows = list(reversed(result.scalars().all()))

    if len(rows) < 10:
        return {"drift_score": 0.0, "flag": False}

    first_half = rows[: len(rows)//2]
    second_half = rows[len(rows)//2 :]

    def avg_temp(xs): return sum((r.temperature_c or 0) for r in xs) / len(xs)
    t1, t2 = avg_temp(first_half), avg_temp(second_half)
    delta = abs(t2 - t1)

    drift_score = min(1.0, delta / 5.0)  # >5°C shift → high drift
    flag = drift_score > 0.5
    return {"drift_score": drift_score, "flag": flag}