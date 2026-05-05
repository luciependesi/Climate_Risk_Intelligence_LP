import struct
import json
import time
import requests
from paho.mqtt import client as mqtt_client

BROKER = "localhost"
PORT = 1883
TOPIC_RAW = "lora/raw"
BACKEND_URL = "http://backend:8000/ingest/iot-reading"

PAYLOAD_FMT = "<IhHHHHhii"

def decode_payload(raw_bytes: bytes) -> dict:
    (
        ts,
        temp_c_x10,
        hum_x10,
        mq135,
        water_x100,
        rain_x100,
        batt_mv,
        rssi,
        lat_e7,
        lon_e7,
    ) = struct.unpack(PAYLOAD_FMT, raw_bytes)

    return {
        "device_id": "esp32-lora-node",
        "ts": ts,
        "temp_c": temp_c_x10 / 10.0,
        "hum": hum_x10 / 10.0,
        "mq135": mq135,
        "water": water_x100 / 100.0,
        "rain": rain_x100 / 100.0,
        "batt_v": batt_mv / 1000.0,
        "rssi": rssi,
        "lat": lat_e7 / 1e7,
        "lon": lon_e7 / 1e7,
    }

def on_message(client, userdata, msg):
    try:
        raw = bytes.fromhex(msg.payload.decode())
        data = decode_payload(raw)
        print("Decoded:", data)
        r = requests.post(BACKEND_URL, json=data, timeout=3)
        print("Backend status:", r.status_code)
    except Exception as e:
        print("Error:", e)

def main():
    client = mqtt_client.Client()
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.subscribe(TOPIC_RAW)
    client.loop_forever()

if __name__ == "__main__":
    main()