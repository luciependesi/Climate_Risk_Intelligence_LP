import struct
from datetime import datetime
from lora_decoder import decode_lora_payload

PAYLOAD_FMT = "<IhHHHHhii"  # must match struct above
from lora_decoder import decode_lora_payload

def on_lora_packet(device_id: str, raw_bytes: bytes):
    decoded = decode_lora_payload(raw_bytes)
    decoded["device_id"] = device_id
    return decoded

def decode_lora_payload(raw_bytes: bytes) -> dict:
    (
        ts,
        temp_c_x10,
        hum_x10,
        mq135,
        water_x100,
        batt_mv,
        rssi,
        lat_e7,
        lon_e7,
    ) = struct.unpack(PAYLOAD_FMT, raw_bytes)

    return {
        "ts": ts,
        "temp_c": temp_c_x10 / 10.0,
        "hum": hum_x10 / 10.0,
        "mq135": float(mq135),
        "water": water_x100 / 100.0,
        "batt_v": batt_mv / 1000.0,
        "rssi": int(rssi),
        "lat": lat_e7 / 1e7,
        "lon": lon_e7 / 1e7,
    }