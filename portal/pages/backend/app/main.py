# app/main.py
# app/main.py
import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.simulator import start_simulator

# Database
from app.db.session import engine
from app.db.base import Base

# Routers
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

# DEMO INGEST (bypassing protobuf)
from app.api.websocket_manager import ws_manager
from fastapi import APIRouter

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


print(">>> RUNNING FROM:", os.getcwd())
print(">>> DEBUG DB URL:", settings.database_url)

app = FastAPI(title=settings.app_name)

# -------------------------------------------------
# CORS
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Startup
# -------------------------------------------------
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# -------------------------------------------------
# Logging
# -------------------------------------------------
app_logger = logging.getLogger("app.requests")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    app_logger.info(f"{request.method} {request.url.path}")
    return await call_next(request)

# -------------------------------------------------
# ROUTERS (clean, no duplicates)
# -------------------------------------------------
app.include_router(demo_router)            # <-- DEMO INGEST
app.include_router(auth_router)
app.include_router(subscribers_router)
app.include_router(devices_router, prefix="/api")
app.include_router(alerts_router)
app.include_router(websocket_router)       # <-- CORRECT WebSocket mount
app.include_router(readings_router)
app.include_router(sensor_router)
app.include_router(risk_router)

# Optional modules
app.include_router(analytics.router)
app.include_router(device_health.router)
app.include_router(cluster_risk.router)

# -------------------------------------------------
# Root
# -------------------------------------------------
@app.get("/")
def root():
    return {"status": "backend running"}

# -------------------------------------------------
# Simulator
# -------------------------------------------------
start_simulator()

@app.get("/__test_route__")
def test_route():
    return {"msg": "THIS IS THE REAL BACKEND"}