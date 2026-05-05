# api/cluster_ws.py
from fastapi import APIRouter, WebSocket
from datetime import datetime
import random

router = APIRouter()

@router.websocket("/ws")
async def cluster_ws(ws: WebSocket):
    await ws.accept()
    while True:
        payload = {
            "timestamp": datetime.utcnow().isoformat(),
            "avg_risk": random.randint(20, 90)
        }
        await ws.send_json(payload)