# protobuf decode
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sensor_reading_pb2 import SensorReading
from ..models.device import DeviceReading, Device
from ..models.schemas import DeviceReadingOut
from .risk_engine import compute_risk_for_device
from .health_service import compute_health_for_device
from .logging_service import log_protobuf
from .websocket_broadcast import ws_manager


async def handle_protobuf_ingest(raw_bytes: bytes, db: AsyncSession):
    # Decode protobuf
    msg = SensorReading()
    msg.ParseFromString(raw_bytes)

    # Log raw + decoded protobuf
    log_protobuf(msg)

    device_id = msg.device_id

    # ----------------------------------------------------------------------
    # ⭐ 1. Update device last_seen + online status + GNSS + virtual flag
    # ----------------------------------------------------------------------
    device = await db.get(Device, device_id)

    if device:
        device.last_seen = datetime.utcnow()
        device.latitude = msg.latitude_deg if hasattr(msg, "latitude_deg") else None
        device.longitude = msg.longitude_deg if hasattr(msg, "longitude_deg") else None
        device.altitude = msg.altitude_m if hasattr(msg, "altitude_m") else None
        device.hdop = msg.hdop if hasattr(msg, "hdop") else None
        device.is_virtual = msg.is_virtual if hasattr(msg, "is_virtual") else False
        device.is_active = True  # online
    else:
        # Auto‑register device if not in DB
        device = Device(
            device_id=device_id,
            name=device_id,
            registered_at=datetime.utcnow(),
            last_seen=datetime.utcnow(),
            latitude=msg.latitude_deg if hasattr(msg, "latitude_deg") else None,
            longitude=msg.longitude_deg if hasattr(msg, "longitude_deg") else None,
            altitude=msg.altitude_m if hasattr(msg, "altitude_m") else None,
            hdop=msg.hdop if hasattr(msg, "hdop") else None,
            is_virtual=msg.is_virtual if hasattr(msg, "is_virtual") else False,
            is_active=True,
        )
        db.add(device)

    # ----------------------------------------------------------------------
    # ⭐ 2. Store reading in DB
    # ----------------------------------------------------------------------
    reading = DeviceReading(
        device_id=device_id,
        timestamp=datetime.utcnow(),
        timestamp_ms=msg.timestamp_ms if hasattr(msg, "timestamp_ms") else None,
        temperature_c=msg.temperature_c,
        humidity=msg.humidity_pct,
        pressure_hpa=msg.pressure_hpa,
        mq135_ppm=msg.mq135_ppm,
        water_level=msg.water_level,
        battery_v=msg.battery_mv / 1000 if hasattr(msg, "battery_mv") else None,
        rssi=msg.rssi if hasattr(msg, "rssi") else None,
        latitude=msg.latitude_deg if hasattr(msg, "latitude_deg") else None,
        longitude=msg.longitude_deg if hasattr(msg, "longitude_deg") else None,
        altitude=msg.altitude_m if hasattr(msg, "altitude_m") else None,
        hdop=msg.hdop if hasattr(msg, "hdop") else None,
    )

    db.add(reading)
    await db.commit()

    # ----------------------------------------------------------------------
    # ⭐ 3. Compute risk + health (battery health included)
    # ----------------------------------------------------------------------
    risk = await compute_risk_for_device(device_id, db)
    health = await compute_health_for_device(device_id, db)

    # ----------------------------------------------------------------------
    # ⭐ 4. Convert ORM → Pydantic → dict
    # ----------------------------------------------------------------------
    reading_out = DeviceReadingOut(
        device_id=reading.device_id,
        timestamp=reading.timestamp.isoformat(),
        timestamp_ms=reading.timestamp_ms,
        temperature_c=reading.temperature_c,
        humidity=reading.humidity,
        pressure_hpa=reading.pressure_hpa,
        mq135_ppm=reading.mq135_ppm,
        water_level=reading.water_level,
        battery_v=reading.battery_v,
        rssi=reading.rssi,
        latitude=reading.latitude,
        longitude=reading.longitude,
        altitude=reading.altitude,
        hdop=reading.hdop,
    ).model_dump()

    # ----------------------------------------------------------------------
    # ⭐ 5. Broadcast UI‑compatible payload
    # ----------------------------------------------------------------------
    await ws_manager.broadcast({
        "type": "reading",
        "device_id": device_id,
        "reading": reading_out,
        "risk": risk,
        "health": health,
        "is_virtual": device.is_virtual,
        "online": True,
        "last_seen": device.last_seen.isoformat(),
    })

    return device_id