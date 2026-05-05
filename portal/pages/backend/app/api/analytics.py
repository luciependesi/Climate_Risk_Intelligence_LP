from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime
from typing import Optional, List, Dict, Any

from app.db.session import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _parse_iso(ts: Optional[str]) -> Optional[datetime]:
    if not ts:
        return None
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid timestamp: {ts}")


@router.get("/devices/{device_id}/hourly")
async def get_hourly_aggregates(
    device_id: str,
    start: Optional[str] = Query(None, description="ISO8601 start time"),
    end: Optional[str] = Query(None, description="ISO8601 end time"),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    start_dt = _parse_iso(start)
    end_dt = _parse_iso(end)

    # Use timestamp_ms -> timestamptz
    sql = """
        SELECT
            date_trunc('hour', to_timestamp(timestamp_ms / 1000.0)) AS bucket,
            avg(temperature_c)      AS temperature_c,
            avg(humidity)           AS humidity,
            avg(pressure_hpa)       AS pressure_hpa,
            avg(air_quality_raw)    AS air_quality_raw,
            avg(rain_level_raw)     AS rain_level_raw,
            avg(water_level_raw)    AS water_level_raw,
            avg(battery_mv)         AS battery_mv,
            count(*)                AS samples
        FROM sensor_readings
        WHERE device_id = :device_id
          AND (:start_ts IS NULL OR to_timestamp(timestamp_ms / 1000.0) >= :start_ts)
          AND (:end_ts   IS NULL OR to_timestamp(timestamp_ms / 1000.0) <= :end_ts)
        GROUP BY bucket
        ORDER BY bucket ASC;
    """

    result = await db.execute(
        text(sql),
        {
            "device_id": device_id,
            "start_ts": start_dt,
            "end_ts": end_dt,
        },
    )
    rows = result.mappings().all()

    return [
        {
            "bucket": r["bucket"].isoformat().replace("+00:00", "Z"),
            "temperature_c": r["temperature_c"],
            "humidity": r["humidity"],
            "pressure_hpa": r["pressure_hpa"],
            "air_quality_raw": r["air_quality_raw"],
            "rain_level_raw": r["rain_level_raw"],
            "water_level_raw": r["water_level_raw"],
            "battery_mv": r["battery_mv"],
            "samples": r["samples"],
        }
        for r in rows
    ]


@router.get("/devices/{device_id}/daily")
async def get_daily_aggregates(
    device_id: str,
    start: Optional[str] = Query(None, description="ISO8601 start time"),
    end: Optional[str] = Query(None, description="ISO8601 end time"),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    start_dt = _parse_iso(start)
    end_dt = _parse_iso(end)

    sql = """
        SELECT
            date_trunc('day', to_timestamp(timestamp_ms / 1000.0)) AS bucket,
            avg(temperature_c)      AS temperature_c,
            avg(humidity)           AS humidity,
            avg(pressure_hpa)       AS pressure_hpa,
            avg(air_quality_raw)    AS air_quality_raw,
            avg(rain_level_raw)     AS rain_level_raw,
            avg(water_level_raw)    AS water_level_raw,
            avg(battery_mv)         AS battery_mv,
            count(*)                AS samples
        FROM sensor_readings
        WHERE device_id = :device_id
          AND (:start_ts IS NULL OR to_timestamp(timestamp_ms / 1000.0) >= :start_ts)
          AND (:end_ts   IS NULL OR to_timestamp(timestamp_ms / 1000.0) <= :end_ts)
        GROUP BY bucket
        ORDER BY bucket ASC;
    """

    result = await db.execute(
        text(sql),
        {
            "device_id": device_id,
            "start_ts": start_dt,
            "end_ts": end_dt,
        },
    )
    rows = result.mappings().all()

    return [
        {
            "bucket": r["bucket"].date().isoformat(),
            "temperature_c": r["temperature_c"],
            "humidity": r["humidity"],
            "pressure_hpa": r["pressure_hpa"],
            "air_quality_raw": r["air_quality_raw"],
            "rain_level_raw": r["rain_level_raw"],
            "water_level_raw": r["water_level_raw"],
            "battery_mv": r["battery_mv"],
            "samples": r["samples"],
        }
        for r in rows
    ]