📁 backend/README.md
© 2026 Lucie Pendesi. All rights reserved.
# Climate Risk Intelligence Backend

This backend powers the Climate Risk Intelligence pipeline from ESP32 LoRa nodes to a TimescaleDB + Grafana stack.

## High-level architecture

- **Edge device:** ESP32-S3 LoRa node with BME280, MQ135, water + rain sensors, GNSS.
- **Transport:**
  - LoRa → gateway → backend (binary payload decoded to JSON), and/or
  - WiFi → HTTP JSON directly to backend.
- **Backend:** FastAPI app (`app.main:app`).
- **Database:** PostgreSQL with TimescaleDB extension.
- **Analytics:** Continuous aggregates (hourly + daily).
- **Visualization:** Grafana dashboards + alerts.

## Data model

Core table: `iot_readings`

- `device_id` (TEXT)
- `ts` (TIMESTAMPTZ) — measurement time
- `temperature_c` (FLOAT)
- `humidity_pct` (FLOAT)
- `pressure_hpa` (FLOAT)
- `mq135_ppm` (FLOAT)
- `water_level` (FLOAT, 0–1)
- `rain_intensity` (FLOAT, 0–1)
- `battery_v` (FLOAT)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `is_virtual` (BOOLEAN)

TimescaleDB turns `iot_readings` into a hypertable and defines:

- `iot_readings_hourly` — hourly averages
- `iot_readings_daily` — daily averages

Retention policies:

- Raw: 180 days
- Hourly: 365 days
- Daily: 5 years

## API layout

- `app/main.py` — FastAPI app, CORS, logging, router registration.
- `app/api/ingest.py` — `/ingest/iot-reading` endpoint.
- `app/schemas/device_reading.py` — Pydantic model `DeviceReadingIn`.
- `app/models/iot_reading.py` — DB insert logic (`insert_reading`).
- `app/database.py` — asyncpg connection pool.

### Ingestion flow

1. Device sends JSON:

   ```json
   {
     "device_id": "esp32-lora-node",
     "timestamp_ms": 1735770000000,
     "temperature_c": 22.5,
     "humidity_pct": 55.0,
     "pressure_hpa": 1013.2,
     "mq135_ppm": 400.0,
     "water_level": 0.2,
     "rain_intensity": 0.0,
     "battery_v": 3.9,
     "latitude": 40.4406,
     "longitude": -79.9959,
     "is_virtual": false
   }


- FastAPI validates with DeviceReadingIn.
- insert_reading() converts timestamp_ms → TIMESTAMPTZ using:
from datetime import datetime, timezone

def ms_to_ts(ms: int) -> datetime:
    return datetime.fromtimestamp(ms / 1000.0, tz=timezone.utc)
- Row is inserted into iot_readings.
- TimescaleDB continuous aggregates update hourly/daily views.
- Grafana queries raw + aggregates for dashboards and alerts.
Running the stack
With Docker Compose:
docker-compose up --build


Services:
- db — TimescaleDB
- backend — FastAPI on http://localhost:8000
- grafana — Grafana on http://localhost:3000
Testing
Run unit tests:
cd backend
pytest


Seeding data
cd backend
python -m scripts.seed_db


This inserts a few sample rows into iot_readings so Grafana panels and queries have data.
Extending
- Add new sensors → extend DeviceReadingIn, DB schema, and Grafana panels.
- Add new devices → use device_id to filter and compare nodes.
- Add risk scores → create new columns or views (e.g., flood_risk_score, air_quality_band).

---

Next step could be:

- A **diagram (text or Mermaid) of the full pipeline**
- **More ingestion tests** (DB verification, error paths)
- **Extra Grafana panels** (risk scores, node comparison, uptime)


