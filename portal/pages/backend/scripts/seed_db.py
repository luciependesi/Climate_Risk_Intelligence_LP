import asyncio
import asyncpg
import time
from datetime import datetime, timezone

# IMPORTANT: password must be URL-encoded
DATABASE_URL = "postgres://postgres:Joy%402019@localhost:5432/climate_risk_intelligence"

SAMPLE_ROWS = [
    {
        "device_id": "esp32-lora-node",
        "temperature_c": 21.5,
        "humidity_pct": 50.0,
        "pressure_hpa": 1012.3,
        "mq135_ppm": 420.0,
        "water_level": 0.1,
        "rain_intensity": 0.0,
        "battery_v": 3.95,
        "latitude": 40.4406,
        "longitude": -79.9959,
        "is_virtual": False,
    },
    {
        "device_id": "esp32-lora-node",
        "temperature_c": 23.0,
        "humidity_pct": 60.0,
        "pressure_hpa": 1010.8,
        "mq135_ppm": 600.0,
        "water_level": 0.3,
        "rain_intensity": 0.2,
        "battery_v": 3.85,
        "latitude": 40.4406,
        "longitude": -79.9959,
        "is_virtual": False,
    },
]

async def main():
    conn = await asyncpg.connect(DATABASE_URL)

    for row in SAMPLE_ROWS:
        ts = int(time.time() * 1000)  # using timestamp_ms BIGINT

        await conn.execute(
            """
            INSERT INTO iot_readings (
                device_id, timestamp_ms,
                temperature_c, humidity_pct, pressure_hpa,
                mq135_ppm, water_level, rain_intensity,
                battery_v, latitude, longitude, is_virtual
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            """,
            row["device_id"],
            ts,
            row["temperature_c"],
            row["humidity_pct"],
            row["pressure_hpa"],
            row["mq135_ppm"],
            row["water_level"],
            row["rain_intensity"],
            row["battery_v"],
            row["latitude"],
            row["longitude"],
            row["is_virtual"],
        )

    await conn.close()
    print("Seeded iot_readings with sample data.")

if __name__ == "__main__":
    asyncio.run(main())