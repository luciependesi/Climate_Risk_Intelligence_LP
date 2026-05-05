# script that sends a real protobuf message
from generator.sensor_reading_pb2 import SensorReading
import requests
import time

msg = SensorReading(
    device_id="dev123",
    timestamp_ms=int(time.time() * 1000),
    temperature_c=22.5,
    humidity_pct=55.2,
    pressure_hpa=1012.3,
    mq135_ppm=180.0,
    water_level=0.12,
    rain_intensity=0.0,
    battery_v=3.78,
    latitude=40.44,
    longitude=-79.99,
)

raw = msg.SerializeToString()

resp = requests.post(
    "http://localhost:8000/ingest",
    headers={"api_key": "TEST123"},
    data=raw
)

print(resp.status_code, resp.text)