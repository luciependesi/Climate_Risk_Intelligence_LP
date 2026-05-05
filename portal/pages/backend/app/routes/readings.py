from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from app.db.session import async_session

router = APIRouter(prefix="/api/readings", tags=["readings"])

@router.get("/hourly/{device_id}")
async def get_hourly(device_id: str):
    query = text("""
        SELECT bucket, avg_mq135, avg_water, avg_battery
        FROM sensor_readings_hourly
        WHERE device_id = :device_id
        ORDER BY bucket DESC
        LIMIT 168;  -- 7 days of hourly data
    """)

    async with async_session() as session:
        rows = (await session.execute(query, {"device_id": device_id})).mappings().all()
        return rows


@router.get("/daily/{device_id}")
async def get_daily(device_id: str):
    query = text("""
        SELECT bucket, avg_temp, avg_humidity, avg_pressure
        FROM sensor_readings_daily
        WHERE device_id = :device_id
        ORDER BY bucket DESC
        LIMIT 30;  -- 30 days
    """)

    async with async_session() as session:
        rows = (await session.execute(query, {"device_id": device_id})).mappings().all()
        return rows