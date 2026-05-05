import json
import os
import paho.mqtt.client as mqtt
from lora_receiver import decode_lora_payload

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))

client = mqtt.Client()
client.connect(MQTT_HOST, MQTT_PORT, 60)

def handle_lora_packet(device_id: str, raw_bytes: bytes):
    data = decode_lora_payload(raw_bytes)
    data["device_id"] = device_id
    topic = f"iot/devices/{device_id}/state"
    client.publish(topic, json.dumps(data), qos=1)