@app.post("/ingest/sensor")
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