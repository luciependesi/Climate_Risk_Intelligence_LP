# © 2026 Lucie Pendesi. All rights reserved.
# Licensed under the MIT License. See the LICENSE file for details.
from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.simulator import start_simulator

# Database
from app.db.session import engine
from app.db.base import Base

# Routers (these MUST be imported BEFORE include_router)
from app.api.auth import router as auth_router
from app.api.devices import router as devices_router
from app.api.subscribers import router as subscribers_router
from app.api.alerts import router as alerts_router
from app.api.websocket import router as websocket_router
from app.api.readings import router as readings_router
from app.api.sensor import router as sensor_router
from app.api.risk import router as risk_router

# Optional modules
from app.api import analytics
from app.api import device_health
from app.api import cluster_risk

# WebSocket manager
from app.api.websocket_manager import ws_manager

# -------------------------
# DEMO ROUTER (PUT HERE)
# -------------------------
demo_router = APIRouter()

@demo_router.post("/ingest/sensor")
async def ingest_sensor():
    decoded = {
        "device_id": "demo-1",
        "reading": {
            "temperature": 26.5,
            "humidity": 58,
            "pressure": 1012,
            "water_level": 0.3,
            "rain_level": 0.1,
            "air_quality": 120
        },
        "health": {
            "battery": 3700
        },
        "online": True,
        "last_seen": "2026-04-20T19:00:00Z",
        "is_virtual": False
    }

    print("📤 DEMO DATA:", decoded)
    await ws_manager.broadcast(decoded)
    return {"status": "ok"}

# -------------------------
# FASTAPI APP
# -------------------------
app = FastAPI(title="Climate Risk Intelligence Portal")

# -------------------------
# CORS (REQUIRED FOR DOCKER + WEBSOCKETS)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# INCLUDE ROUTERS (PUT THIS AFTER)
# -------------------------
app.include_router(demo_router)   # <--- MUST BE FIRST
app.include_router(auth_router)
app.include_router(subscribers_router)
app.include_router(devices_router, prefix="/api")
app.include_router(alerts_router)
app.include_router(websocket_router)
app.include_router(readings_router)
app.include_router(sensor_router)
app.include_router(risk_router)