# gateway/lora_decoder.py
import struct
import requests
import time

BACKEND_URL = "http://your-backend/ingest/iot-reading"

# Matches: uint32, int16, uint16, uint16, uint16, uint16, uint16, uint16, int16, int32, int32
PAYLOAD_FMT = "<IhHHHHHHhii"
PAYLOAD_SIZE = struct.calcsize(PAYLOAD_FMT)

def decode_payload(raw: bytes) -> dict:
    if len(raw) != PAYLOAD_SIZE:
        raise ValueError(f"Invalid payload size: {len(raw)} != {PAYLOAD_SIZE}")

    (
        ts,
        temp_c_x10,
        hum_x10,
        pressure_x10,
        mq135_ppm_x10,
        water_x100,
        rain_x100,
        batt_mv,
        rssi,
        lat_e7,
        lon_e7,
    ) = struct.unpack(PAYLOAD_FMT, raw)

    return {
        "device_id": "esp32-lora-node",
        "timestamp_ms": int(ts) * 1000,
        "temperature_c": temp_c_x10 / 10.0,
        "humidity_pct": hum_x10 / 10.0,
        "pressure_hpa": pressure_x10 / 10.0,
        "mq135_ppm": mq135_ppm_x10 / 10.0,
        "water_level": water_x100 / 100.0,
        "rain_intensity": rain_x100 / 100.0,
        "battery_v": batt_mv / 1000.0,
        "latitude": lat_e7 / 1e7,
        "longitude": lon_e7 / 1e7,
        "is_virtual": False,
    }

def forward_to_backend(data: dict):
    r = requests.post(BACKEND_URL, json=data, timeout=5)
    print("Backend status:", r.status_code, r.text)

# Example usage with some LoRa library:
def handle_lora_rx(raw_bytes: bytes):
    try:
        data = decode_payload(raw_bytes)
        print("Decoded:", data)
        forward_to_backend(data)
    except Exception as e:
        print("Decode error:", e)