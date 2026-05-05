from datetime import datetime
from pathlib import Path
import json
from sensor_reading_pb2 import SensorReading

LOG_ROOT = Path("logs")

def log_protobuf(msg: SensorReading):
    day_dir = LOG_ROOT / datetime.utcnow().strftime("%Y-%m-%d")
    day_dir.mkdir(parents=True, exist_ok=True)

    ts = datetime.utcnow().strftime("%H-%M-%S-%f")
    base = day_dir / f"{msg.device_id}_{ts}"

    # raw protobuf
    with open(base.with_suffix(".bin"), "wb") as f:
        f.write(msg.SerializeToString())

    # decoded JSON
    payload = {
        "device_id": msg.device_id,
        "temperature_c": msg.temperature_c,
        "humidity_pct": msg.humidity_pct,
        "pressure_hpa": msg.pressure_hpa,
        "mq135_ppm": msg.mq135_ppm,
        "water_level": msg.water_level,
        "is_virtual": msg.is_virtual,
        "timestamp_ms": msg.timestamp_ms,
    }
    with open(base.with_suffix(".json"), "w") as f:
        json.dump(payload, f)