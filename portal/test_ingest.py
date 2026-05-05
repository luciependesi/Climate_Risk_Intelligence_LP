import requests
import time
import random

API_URL = "http://localhost:8000/ingest/ingest/sensor"

def send_reading():
    payload = {
        "device_id": "device-1",
        "temperature": round(random.uniform(20, 30), 2),
        "humidity": round(random.uniform(30, 60), 2),
        "pm25": round(random.uniform(5, 50), 2),
        "co2": round(random.uniform(350, 900), 2),
        "health": round(random.uniform(0.7, 1.0), 2),
        "risk_score": round(random.uniform(0.1, 0.9), 2),
        "confidence": round(random.uniform(0.5, 1.0), 2),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    print("Sending:", payload)
    r = requests.post(API_URL, json=payload)
    print("Status:", r.status_code)
    print("Response:", r.text)

if __name__ == "__main__":
    while True:
        send_reading()
        time.sleep(2)