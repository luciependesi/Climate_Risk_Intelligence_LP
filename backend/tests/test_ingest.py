import os
import time
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_ingest_valid_reading():
    now_ms = int(time.time() * 1000)

    payload = {
        "device_id": "esp32-lora-node",
        "timestamp_ms": now_ms,
        "temperature_c": 22.5,
        "humidity_pct": 55.0,
        "pressure_hpa": 1013.2,
        "mq135_ppm": 400.0,
        "water_level": 0.2,
        "rain_intensity": 0.0,
        "battery_v": 3.9,
        "latitude": 40.4406,
        "longitude": -79.9959,
        "is_virtual": False,
    }

    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/ingest/iot-reading", json=payload)

    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_ingest_future_timestamp_rejected():
    future_ms = int(time.time() * 1000) + 10 * 60_000  # +10 min

    payload = {
        "device_id": "esp32-lora-node",
        "timestamp_ms": future_ms,
        "temperature_c": 22.5,
        "humidity_pct": 55.0,
        "pressure_hpa": 1013.2,
        "mq135_ppm": 400.0,
        "water_level": 0.2,
        "rain_intensity": 0.0,
        "battery_v": 3.9,
        "latitude": 40.4406,
        "longitude": -79.9959,
        "is_virtual": False,
    }

    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/ingest/iot-reading", json=payload)

    assert resp.status_code == 400
    assert "timestamp_ms" in resp.text