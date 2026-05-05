import random
import time
import threading
from datetime import datetime

from .config import settings

state = {
    "risk": {"score": 62, "level": "Medium", "model_score": 50},
    "health": {
        "status": "healthy",
        "last_seen": "2026-03-29T20:31:00",
        "avg_interval_sec": 58.2,
        "anomaly_rate": 0.12,
        "uptime_percent": 98.4,
    },
}


def simulate():
    while True:
        score = random.randint(10, 95)
        if score >= 80:
            level = "High"
        elif score >= 60:
            level = "Medium"
        else:
            level = "Low"

        state["risk"]["score"] = score
        state["risk"]["level"] = level
        state["risk"]["model_score"] = random.randint(40, 90)

        state["health"]["anomaly_rate"] = round(random.uniform(0.0, 0.3), 2)
        state["health"]["uptime_percent"] = round(random.uniform(95.0, 99.9), 1)
        state["health"]["last_seen"] = datetime.utcnow().isoformat()

        time.sleep(10)


def start_simulator():
    t = threading.Thread(target=simulate, daemon=True)
    t.start()