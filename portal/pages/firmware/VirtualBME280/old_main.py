from fastapi import FastAPI, Request
from generator.sensor_reading_pb2 import SensorReading
import psycopg2
from datetime import datetime

app = FastAPI()

def get_db():
    return psycopg2.connect(
        host="localhost",
        database="climate_risk_intelligence",
        user="postgres",
        password="Joy@2019"
    )

@app.post("/ingest")
async def ingest_sensor_data(request: Request):
    raw_bytes = await request.body()

    msg = SensorReading()
    msg.ParseFromString(raw_bytes)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO iot_sensor_stream (
            device_id,
            timestamp,
            temperature_c,
            humidity_percent,
            pressure_hpa,
            air_quality_ppm,
            rain_detected,
            water_level_cm,
            latitude,
            longitude
        ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        msg.device_id,
        datetime.now(),
        msg.temperature_c,
        msg.humidity_pct,
        msg.pressure_hpa,
        msg.mq135_ppm,
        msg.is_virtual,
        msg.water_level,
        0.0,
        0.0
    ))

    conn.commit()
    cur.close()
    conn.close()

    return {"status": "ok"}