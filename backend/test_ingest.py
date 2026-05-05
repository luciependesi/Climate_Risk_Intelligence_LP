import time
import random
import hmac
import hashlib
import requests
from app.proto.climate_reading_pb2 import ClimateReading

API_URL = "http://localhost:8000/ingest/sensor"
SECRET_KEY = "super-secret-key"  # must match security.py
API_KEY = "climate-risk-key"     # if your backend still checks this

def make_signature(body: bytes) -> str:
    return hmac.new(SECRET_KEY.encode(), body, hashlib.sha256).hexdigest()

def send_reading():
    msg = ClimateReading()

    msg.device_id = 1
    msg.ts_ms = int(time.time())
    msg.mq135_ppm = random.randint(50, 400)
    msg.water_level_mm = random.randint(0, 200)
    msg.rain_intensity_x10 = random.randint(0, 50)
    msg.battery_mv = random.randint(3600, 4200)
    msg.lat_e7 = int(40.4406 * 1e7)
    msg.lon_e7 = int(-79.9959 * 1e7)

    raw_bytes = msg.SerializeToString()
    signature = make_signature(raw_bytes)

    headers = {
        "Content-Type": "application/octet-stream",
        "X-Signature": signature,
        "api-key": API_KEY,
    }

    print("Sending ClimateReading protobuf:")
    print(msg)

    resp = requests.post(API_URL, data=raw_bytes, headers=headers)
    print("Status:", resp.status_code)
    print("Response:", resp.text)

if __name__ == "__main__":
    while True:
        send_reading()
        time.sleep(2)