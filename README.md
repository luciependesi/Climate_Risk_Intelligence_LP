![Security Scan](https://github.com/luciependesi/Climate_Risk_Intelligence_LP/actions/workflows/security.yml/badge.svg)
<<<<<<< HEAD
© 2026 Lucie Pendesi. All rights reserved.
Verifiable Climate Risk Intelligence as a Public Subscription Service A modular,

&#x20;transparent, and verifiable climate‑risk intelligence platform that ingests IoT sensor data, computes unified risk scores, detects model drift, tracks model evolution, exposes public subscription services, and provides a fully animated frontend portal for both internal analysts and public users. This project demonstrates how environmental sensing, machine learning, transparency tooling, and public‑good infrastructure can be combined into a trustworthy climate‑risk intelligence system. --- 

 Core Features

&#x20;1. Real‑Time Sensor Ingestion\*\* - ESP32‑S3 LoRaWAN devices send protobuf‑encoded payloads. - FastAPI backend decodes, validates, and stores readings. - Device authentication via API keys. - Signature verification for tamper‑resistant ingestion.

&#x20;2. Unified Climate Risk Score\*\* A backend module computes a normalized risk score ∈ \[0, 1] using: - Temperature - Humidity - Air quality - Rainfall - Water level - Battery health - GNSS validity The frontend animates transitions between scores for smooth UX.

&#x20;3. Climate Confidence Index (CCI)\*\* A trust score ∈ \[0, 1] that quantifies: - Data completeness - Device health - Model stability - Risk‑adjusted uncertainty Displayed in the dashboard and public portal.

&#x20;4. Model Drift Detection\*\* Backend drift module detects: - Feature drift - Prediction drift - Rolling distribution shifts Outputs: - drift\_score - drift\_flag - Drift explanation Displayed in the Drift Panel. 

5\. Model Evolution Tracking\*\* Every model update is logged with: - Version - Timestamp - Description - Drift score - Average confidence Displayed in a Model Timeline UI. 

6\. Public Subscription Service\*\* Public users can subscribe to: - High‑risk alerts - Location‑based alerts - Confidence drops - Drift events - Model updates Delivery channels: - Webhook - RSS feed - JSON feed

&#x20;7. Security + Verification Layer\*\* - HMAC‑SHA256 signature verification - Schema version validation - Model version stamping - Audit logging - Integrity checks

&#x20;8. Fully Animated Frontend Portal\*\* Built with React + Vite: - Live risk gauge - Sparkline + trend arrows - Historical charts - Cluster risk - Device health - Alerts panel - Subscriber settings - Public portal - Dark/light theme - Animated map with risk‑colored markers --- 



 System Architecture ESP32-S3 → LoRaWAN → TTN → FastAPI Ingestion → PostgreSQL ↓ Risk / Health / CCI / Drift ↓ Public API + Subscription Service ↓ Internal Dashboard + Public Portal (React) --- 



1\. Backend Modules | Module | Purpose | |--------|---------| | ingest.py | Protobuf ingestion + signature verification | | sensor.py | Latest readings, history, risk, confidence | | cluster.py | Cluster‑level risk aggregation | | health.py | Device reliability scoring | | drift.py | Model drift detection | | confidence.py | Climate Confidence Index | | model\_versions.py | Model evolution tracking | | subscriptions.py | Public subscription service | | security.py | HMAC verification + schema validation | --- 


2\. Frontend Components | Component | Purpose | |----------|---------| | RiskGauge | Animated unified risk score | | RiskTrendCard | Sparkline + trend arrows | | HistoricalCharts | Temperature, humidity, AQI, rainfall | | RiskDecomposition | Why the risk score changed | | ClusterRiskCard | Aggregated cluster risk | | DeviceHealthCard | Device reliability | | AlertsPanel | Subscriber‑filtered alerts | | DeviceMap | Animated map with risk markers | | SubscriberSettings | Thresholds + preferences | | ModelTimeline | Model evolution history | | DriftPanel | Drift score + flag | | PublicSubscriptionForm | Public webhook subscription | | VerificationPanel | Security + integrity info | --- 


3\. Testing Checklist - Mock mode - Live mode - Device switching - Cluster switching - Risk score transitions - Drift detection - Confidence index - Subscription creation - Map markers - Model version logging - Signature verification

IV. SecuritY
• 	JWT authentication (optional)
• 	RLS policies for multi‑tenant access
• 	HTTPS recommended in production
• 	MQTT credentials recommended
V.  Docker Compose
Services
• 	 (FastAPI)
• 	 (MQTT → FastAPI)
• 	 (MQTT broker)
• 	 (PostgreSQL)
• 	 (React dashboard)


&#x20; Architecture

┌──────────────────────────┐

│   LoRa Sensor Devices    │

└──────────────┬───────────┘

&#x20;              │ LoRaWAN

&#x20;              ▼

┌──────────────────────────┐

│   LoRa Gateway / Bridge  │

│ (TTN, ChirpStack, ESP32) │

└──────────────┬───────────┘

&#x20;              │ MQTT publish

&#x20;              ▼

┌──────────────────────────┐

│  MQTT Broker (Mosquitto) │

└──────────────┬───────────┘

&#x20;              │ subscribe

&#x20;              ▼

┌──────────────────────────┐

│ MQTT Ingestion Service   │

│  (Python, paho-mqtt)     │

│  Converts MQTT → REST    │

└──────────────┬───────────┘

&#x20;              │ POST /ingest

&#x20;              ▼

┌──────────────────────────┐

│ FastAPI Backend          │

│  - Device registry       │

│  - Risk scoring          │

│  - PostgreSQL storage    │

│  - WebSocket live feed   │

└──────────────┬───────────┘

&#x20;              │ WebSocket

&#x20;              ▼

┌──────────────────────────┐

│ React Portal (Vite)      │

│  - Live dashboard         │

│  - Timelines, clusters    │

│  - Animated transitions   │

└──────────────────────────┘

.

├── backend/                 # FastAPI backend

│   ├── app/

│   │   ├── api/

│   │   ├── models/

│   │   ├── services/

│   │   ├── websocket/

│   │   └── main.py

│   ├── Dockerfile

│   └── requirements.txt

│

├── mqtt\_ingestor/           # MQTT → FastAPI microservice

│   ├── main.py

│   ├── Dockerfile

│   └── requirements.txt

│

├── portal/                  # React dashboard

│   ├── src/

│   ├── public/

│   ├── vite.config.js

│   └── package.json

│

├── docker-compose.yml

└── README.md

Services

&#x20;FastAPI Backend

Responsibilities

Device ingestion ()

Device registry

Risk scoring (heat, flood, air quality)

Historical + latest readings

WebSocket live stream ()

PostgreSQL persistence

RLS policies for multi‑tenant security

Tech

FastAPI

SQLAlchemy

PostgreSQL

Uvicorn / Gunicorn

Pydantic v2

Async WebSockets

2\. MQTT Ingestion Microservice

This is the MQTT → FastAPI bridge.

Responsibilities

Subscribe to MQTT topics:

devices/+/raw

devices/+/health

devices/+/alerts



Convert MQTT payloads → JSON

Forward them to FastAPI ingestion endpoint:

*POST http://backend:8000/ingest/iot-reading*

Retry on failure

• Buffer messages if backend is offline

Tech

* Python
* paho‑mqtt
* httpx (async HTTP client)

3\. React Portal (Vite)

Features

* Live WebSocket device stream
* Animated risk score transitions
* Skeleton loaders
* Device health timeline
* Risk timeline chart
* Device map
* Multi‑device health clusters
* Mock/live toggle

Tech

* React + Vite
* Zustand (optional)
* Recharts / D3
* Tailwind or custom CSS

=======
Verifiable Climate Risk Intelligence as a Public Subscription Service A modular,

&#x20;transparent, and verifiable climate‑risk intelligence platform that ingests IoT sensor data, computes unified risk scores, detects model drift, tracks model evolution, exposes public subscription services, and provides a fully animated frontend portal for both internal analysts and public users. This project demonstrates how environmental sensing, machine learning, transparency tooling, and public‑good infrastructure can be combined into a trustworthy climate‑risk intelligence system. --- 

 Core Features

&#x20;1. Real‑Time Sensor Ingestion\*\* - ESP32‑S3 LoRaWAN devices send protobuf‑encoded payloads. - FastAPI backend decodes, validates, and stores readings. - Device authentication via API keys. - Signature verification for tamper‑resistant ingestion.

&#x20;2. Unified Climate Risk Score\*\* A backend module computes a normalized risk score ∈ \[0, 1] using: - Temperature - Humidity - Air quality - Rainfall - Water level - Battery health - GNSS validity The frontend animates transitions between scores for smooth UX.

&#x20;3. Climate Confidence Index (CCI)\*\* A trust score ∈ \[0, 1] that quantifies: - Data completeness - Device health - Model stability - Risk‑adjusted uncertainty Displayed in the dashboard and public portal.

&#x20;4. Model Drift Detection\*\* Backend drift module detects: - Feature drift - Prediction drift - Rolling distribution shifts Outputs: - drift\_score - drift\_flag - Drift explanation Displayed in the Drift Panel. 

5\. Model Evolution Tracking\*\* Every model update is logged with: - Version - Timestamp - Description - Drift score - Average confidence Displayed in a Model Timeline UI. 

6\. Public Subscription Service\*\* Public users can subscribe to: - High‑risk alerts - Location‑based alerts - Confidence drops - Drift events - Model updates Delivery channels: - Webhook - RSS feed - JSON feed

&#x20;7. Security + Verification Layer\*\* - HMAC‑SHA256 signature verification - Schema version validation - Model version stamping - Audit logging - Integrity checks

&#x20;8. Fully Animated Frontend Portal\*\* Built with React + Vite: - Live risk gauge - Sparkline + trend arrows - Historical charts - Cluster risk - Device health - Alerts panel - Subscriber settings - Public portal - Dark/light theme - Animated map with risk‑colored markers --- 



 System Architecture ESP32-S3 → LoRaWAN → TTN → FastAPI Ingestion → PostgreSQL ↓ Risk / Health / CCI / Drift ↓ Public API + Subscription Service ↓ Internal Dashboard + Public Portal (React) --- 



1\. Backend Modules | Module | Purpose | |--------|---------| | ingest.py | Protobuf ingestion + signature verification | | sensor.py | Latest readings, history, risk, confidence | | cluster.py | Cluster‑level risk aggregation | | health.py | Device reliability scoring | | drift.py | Model drift detection | | confidence.py | Climate Confidence Index | | model\_versions.py | Model evolution tracking | | subscriptions.py | Public subscription service | | security.py | HMAC verification + schema validation | --- 


2\. Frontend Components | Component | Purpose | |----------|---------| | RiskGauge | Animated unified risk score | | RiskTrendCard | Sparkline + trend arrows | | HistoricalCharts | Temperature, humidity, AQI, rainfall | | RiskDecomposition | Why the risk score changed | | ClusterRiskCard | Aggregated cluster risk | | DeviceHealthCard | Device reliability | | AlertsPanel | Subscriber‑filtered alerts | | DeviceMap | Animated map with risk markers | | SubscriberSettings | Thresholds + preferences | | ModelTimeline | Model evolution history | | DriftPanel | Drift score + flag | | PublicSubscriptionForm | Public webhook subscription | | VerificationPanel | Security + integrity info | --- 


3\. Testing Checklist - Mock mode - Live mode - Device switching - Cluster switching - Risk score transitions - Drift detection - Confidence index - Subscription creation - Map markers - Model version logging - Signature verification

IV. SecuritY
• 	JWT authentication (optional)
• 	RLS policies for multi‑tenant access
• 	HTTPS recommended in production
• 	MQTT credentials recommended
V.  Docker Compose
Services
• 	 (FastAPI)
• 	 (MQTT → FastAPI)
• 	 (MQTT broker)
• 	 (PostgreSQL)
• 	 (React dashboard)


&#x20; Architecture

┌──────────────────────────┐

│   LoRa Sensor Devices    │

└──────────────┬───────────┘

&#x20;              │ LoRaWAN

&#x20;              ▼

┌──────────────────────────┐

│   LoRa Gateway / Bridge  │

│ (TTN, ChirpStack, ESP32) │

└──────────────┬───────────┘

&#x20;              │ MQTT publish

&#x20;              ▼

┌──────────────────────────┐

│  MQTT Broker (Mosquitto) │

└──────────────┬───────────┘

&#x20;              │ subscribe

&#x20;              ▼

┌──────────────────────────┐

│ MQTT Ingestion Service   │

│  (Python, paho-mqtt)     │

│  Converts MQTT → REST    │

└──────────────┬───────────┘

&#x20;              │ POST /ingest

&#x20;              ▼

┌──────────────────────────┐

│ FastAPI Backend          │

│  - Device registry       │

│  - Risk scoring          │

│  - PostgreSQL storage    │

│  - WebSocket live feed   │

└──────────────┬───────────┘

&#x20;              │ WebSocket

&#x20;              ▼

┌──────────────────────────┐

│ React Portal (Vite)      │

│  - Live dashboard         │

│  - Timelines, clusters    │

│  - Animated transitions   │

└──────────────────────────┘

.

├── backend/                 # FastAPI backend

│   ├── app/

│   │   ├── api/

│   │   ├── models/

│   │   ├── services/

│   │   ├── websocket/

│   │   └── main.py

│   ├── Dockerfile

│   └── requirements.txt

│

├── mqtt\_ingestor/           # MQTT → FastAPI microservice

│   ├── main.py

│   ├── Dockerfile

│   └── requirements.txt

│

├── portal/                  # React dashboard

│   ├── src/

│   ├── public/

│   ├── vite.config.js

│   └── package.json

│

├── docker-compose.yml

└── README.md

Services

&#x20;FastAPI Backend

Responsibilities

Device ingestion ()

Device registry

Risk scoring (heat, flood, air quality)

Historical + latest readings

WebSocket live stream ()

PostgreSQL persistence

RLS policies for multi‑tenant security

Tech

FastAPI

SQLAlchemy

PostgreSQL

Uvicorn / Gunicorn

Pydantic v2

Async WebSockets

2\. MQTT Ingestion Microservice

This is the MQTT → FastAPI bridge.

Responsibilities

Subscribe to MQTT topics:

devices/+/raw

devices/+/health

devices/+/alerts



Convert MQTT payloads → JSON

Forward them to FastAPI ingestion endpoint:

*POST http://backend:8000/ingest/iot-reading*

Retry on failure

• Buffer messages if backend is offline

Tech

* Python
* paho‑mqtt
* httpx (async HTTP client)

3\. React Portal (Vite)

Features

* Live WebSocket device stream
* Animated risk score transitions
* Skeleton loaders
* Device health timeline
* Risk timeline chart
* Device map
* Multi‑device health clusters
* Mock/live toggle

Tech

* React + Vite
* Zustand (optional)
* Recharts / D3
* Tailwind or custom CSS

>>>>>>> ec266e030a1bb69c6c443f7f0783e86306c7c764
Capstone project spring 2026 Lucie Pendesi