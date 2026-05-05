import requests
from generator.sensor_reading_pb2 import SensorReading

# 1. Create a real SensorReading protobuf message
msg = SensorReading()
msg.device_id = "ESP32_001"
msg.temperature_c = 24.3
msg.humidity_pct = 23.9
msg.pressure_hpa = 1021
msg.mq135_ppm = 300
msg.water_level = 12.3
msg.is_virtual = True
msg.timestamp_ms = 20022   # or any number you want

# 2. Encode it to bytes (exactly like ESP32)
encoded_bytes = msg.SerializeToString()

print("Encoded protobuf bytes:", encoded_bytes)

# 3. Send to your FastAPI server
url = "http://127.0.0.1:8000/ingest"

headers = {
    "Content-Type": "application/octet-stream",
      "api-key": "SECRET123"   # <--  real key
}

response = requests.post(
    url,
    data=encoded_bytes,
    headers=headers
)

print("Status:", response.status_code)
print("Response:", response.text)