import asyncpg
from datetime import datetime, timezone

def ms_to_ts(ms: int) -> datetime:
    return datetime.fromtimestamp(ms / 1000.0, tz=timezone.utc)

INSERT_READING = """
INSERT INTO iot_readings (
    device_id,
    timestamp_ms,
    temperature_c,
    humidity_pct,
    pressure_hpa,
    mq135_ppm,
    water_level,
    rain_intensity,
    battery_v,
    latitude,
    longitude,
    is_virtual
) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
)
"""

async def insert_reading(pool, reading):
    ts = ms_to_ts(reading.timestamp_ms)

    async with pool.acquire() as conn:
        await conn.execute(
            INSERT_READING,
            reading.device_id,
            ts,                                # ← converted timestamp
            reading.temperature_c,
            reading.humidity_pct,
            reading.pressure_hpa,
            reading.mq135_ppm,
            reading.water_level,
            reading.rain_intensity,
            reading.battery_v,
            reading.latitude,
            reading.longitude,
            reading.is_virtual,
        )