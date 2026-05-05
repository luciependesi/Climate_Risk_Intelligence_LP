# app/api/readings.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.db.deps import get_db

router = APIRouter(tags=["readings"])

# ---------------------------------------------------------
# 1. /sensor/latest?device_id=1
# ---------------------------------------------------------
@router.get("/sensor/latest")
async def sensor_latest(
    device_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = text("""
        SELECT *
        FROM  sensor_readings
        WHERE device_id = :device_id
        ORDER BY timestamp_ms DESC
        LIMIT 1
    """)

    result = await db.execute(query, {"device_id": device_id})
    row = result.mappings().first()

    if not row:
        raise HTTPException(status_code=404, detail="No readings for this device")

    return dict(row)

# ---------------------------------------------------------
# 2. /sensor/history?device_id=1&limit=50
# ---------------------------------------------------------
@router.get("/sensor/history")
async def sensor_history(
    device_id: str,
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    query = text("""
        SELECT *
        FROM  sensor_readings
        WHERE device_id = :device_id
        ORDER BY timestamp_ms DESC
        LIMIT :limit
    """)

    result = await db.execute(query, {"device_id": device_id, "limit": limit})
    rows = result.mappings().all()

    return [dict(r) for r in rows]

# ---------------------------------------------------------
# 3. /api/readings?device_id=1&limit=100
#    (DeviceDetailDrawer.tsx expects this)
# ---------------------------------------------------------
@router.get("/api/readings")
async def api_readings(
    device_id: str,
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    query = text("""
        SELECT *
        FROM  sensor_readings
        WHERE device_id = :device_id
        ORDER BY timestamp_ms DESC
        LIMIT :limit
    """)

    result = await db.execute(query, {"device_id": device_id, "limit": limit})
    rows = result.mappings().all()

    return [dict(r) for r in rows]