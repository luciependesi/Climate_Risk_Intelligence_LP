# © 2026 Lucie Pendesi. All rights reserved.
# Licensed under the MIT License. See the LICENSE file for details.
# FastAPI ingestion + frontend endpoints for sensor data.
# app/api/ingest.py
# app/api/ingest.py
from fastapi import APIRouter
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request, Depends
from app.api.websocket_manager import ws_manager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.db.session import get_db
from app.core.security import verify_request_signature
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.api.websocket_manager import ws_manager

from app.proto.sensor_pb2 import SensorReading as PbSensorReading

router = APIRouter(tags=["ingest"])

@router.post("/ingest/sensor")
async def ingest_sensor(request: Request):
    raw = await request.body()
    print("📡 Incoming raw bytes:", raw)
    await ws_manager.broadcast({"raw": list(raw)})
    return {"status": "ok"}

    # 1. Raw protobuf bytes
    raw_body = await request.body()

    # 2. Signature verification
    verify_request_signature(request, raw_body)

    # 3. Decode protobuf
    pb = PbSensorReading()
    pb.ParseFromString(raw_body)

    # 4. Upsert Device
    stmt = select(Device).where(Device.device_id == pb.device_id)
    result = await db.execute(stmt)
    device = result.scalar_one_or_none()

    now = datetime.utcnow()

    if not device:
        device = Device(
            device_id=pb.device_id,
            created_at=now,
            last_seen=now,
        )
        db.add(device)
    else:
        device.last_seen = now

    # 5. Insert SensorReading row
    reading = SensorReading(
        device_id=pb.device_id,

        temperature_c=pb.temperature_c,
        humidity_percent=pb.humidity_percent,
        pressure_hpa=pb.pressure_hpa,

        air_quality_raw=pb.air_quality_raw,
        rain_level_raw=pb.rain_level_raw,
        water_level_raw=pb.water_level_raw,

        battery_mv=pb.battery_mv,

        gnss_enabled=pb.gnss_enabled,
        gnss_fix_valid=pb.gnss_fix_valid,
        latitude_deg=pb.latitude_deg,
        longitude_deg=pb.longitude_deg,
        altitude_m=pb.altitude_m,
        hdop=pb.hdop,

        timestamp_ms=pb.timestamp_ms,
        created_at=now,
    )

    db.add(reading)
    await db.commit()

    # 6. JSON-safe dict for WebSocket
    data = {
        "device_id": pb.device_id,
        "reading": {
            "temperature_c": pb.temperature_c,
            "humidity_percent": pb.humidity_percent,
            "pressure_hpa": pb.pressure_hpa,

            "air_quality_raw": pb.air_quality_raw,
            "rain_level_raw": pb.rain_level_raw,
            "water_level_raw": pb.water_level_raw,

            "battery_mv": pb.battery_mv,

            "gnss_enabled": pb.gnss_enabled,
            "gnss_fix_valid": pb.gnss_fix_valid,
            "latitude_deg": pb.latitude_deg,
            "longitude_deg": pb.longitude_deg,
            "altitude_m": pb.altitude_m,
            "hdop": pb.hdop,

            "timestamp_ms": pb.timestamp_ms,
        },
        "risk": {"score": 0.0},
        "health": {"battery": pb.battery_mv},
    }

    print("📡 Incoming:", data)

    # 7. Broadcast
    await ws_manager.broadcast(data)

    return {"status": "ok"}