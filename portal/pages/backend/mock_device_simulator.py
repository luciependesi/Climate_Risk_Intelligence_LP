# Simulates a device by generating random sensor readings and sending them to the API.
import time
import random
import requests
from generator.sensor_reading_pb2 import SensorReading
from app.proto.sensor_pb2 import SensorReading

API_URL = "http://localhost:8000/ingest"
API_KEY = "TEST123"  # must exist in devices table

def generate_reading():
    return SensorReading(
        device_id="dev123",  # overridden by API key mapping
        timestamp_ms=int(time.time() * 1000),
        temperature_c=20 + random.uniform(-2, 5),
        humidity_pct=40 + random.uniform(-5, 20),
        pressure_hpa=1010 + random.uniform(-5, 5),
        mq135_ppm=150 + random.uniform(-30, 60),
        water_level=random.uniform(0, 0.3),
        rain_intensity=random.choice([0.0, 0.1, 0.5]),
        battery_v=3.6 + random.uniform(-0.1, 0.2),
        latitude=40.44,
        longitude=-79.99,
    )

def send_loop():
    while True:
        msg = generate_reading()
        raw = msg.SerializeToString()

        resp = requests.post(
            API_URL,
            headers={"api_key": API_KEY, "Content-Type": "application/octet-stream"},
            data=raw,
        )

        print(time.strftime("%H:%M:%S"), resp.status_code, resp.text)
        time.sleep(1)

if __name__ == "__main__":
    send_loop()