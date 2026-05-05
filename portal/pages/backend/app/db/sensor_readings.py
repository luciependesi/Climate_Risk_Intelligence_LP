from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sensor_reading import SensorReading
from app.db.base_class import Base

async def store_reading(db: AsyncSession, reading: SensorReading):
    db.add(reading)
    await db.commit()
    await db.refresh(reading)
    return reading