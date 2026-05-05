import os
import json
import logging
import paho.mqtt.client as mqtt
import requests

logging.basicConfig(level=logging.INFO)

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
TOPIC = "iot/devices/+/state"

def on_connect(client, userdata, flags, rc):
    logging.info("Connected to MQTT with result code %s", rc)
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        logging.info("Received MQTT message on %s: %s", msg.topic, payload)
        r = requests.post(f"{BACKEND_URL}/ingest/iot-reading", json=payload, timeout=3)
        r.raise_for_status()
    except Exception as e:
        logging.exception("Failed to forward message: %s", e)

def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_HOST, MQTT_PORT, 60)
    client.loop_forever()

if __name__ == "__main__":
    main()