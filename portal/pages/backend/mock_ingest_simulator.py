# this is a simple script to simulate sensor data ingestion for testing purposes.
import time
import requests
import random
from datetime import datetime
from app.proto.climate_reading_pb2 import ClimateReading

URL = "http://localhost:8000/ingest/sensor"

def random_reading(device_id):
    msg = ClimateReading()
    msg.device_id = device_id
    msg.ts_ms = int(time.time() * 1000)
    msg.mq135_ppm = random.uniform(120, 240)
    msg.water_level_mm = random.uniform(10, 20)
    msg.battery_mv = random.uniform(3400, 3800)
    msg.lat_e7 = int((40.44 + random.uniform(-0.01, 0.01)) * 1e7)
    msg.lon_e7 = int((-79.99 + random.uniform(-0.01, 0.01)) * 1e7)
    return msg

while True:
    for device in ["device_1", "device_2"]:
        msg = random_reading(device)
        raw = msg.SerializeToString()

        # No signature for mock mode
        headers = {"x-signature": "mock-signature"}

        try:
            r = requests.post(URL, data=raw, headers=headers)
            print(device, r.status_code, r.text)
        except Exception as e:
            print("Error:", e)

    time.sleep(1)