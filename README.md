<p align="center">
  <img src="docs/logo.png" width="180" alt="Climate Risk Intelligence Logo">
</p>

<h1 align="center">Climate Risk Intelligence Platform</h1>

<p align="center">
  <img src="https://github.com/luciependesi/Climate_Risk_Intelligence_LP/actions/workflows/security.yml/badge.svg" alt="Security Scan">
  <img src="https://github.com/luciependesi/Climate_Risk_Intelligence_LP/actions/workflows/docker.yml/badge.svg" alt="Docker Build">
  <img src="https://github.com/luciependesi/Climate_Risk_Intelligence_LP/actions/workflows/python.yml/badge.svg" alt="Python Lint & Test">
  <img src="https://github.com/luciependesi/Climate_Risk_Intelligence_LP/actions/workflows/release.yml/badge.svg" alt="Release">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white" alt="Python Version">
</p>

---

#  Overview

## Verifiable Climate Risk Intelligence as a Public Subscription Service

A modular, transparent, and verifiable climate-risk intelligence platform that ingests IoT sensor data, computes unified climate risk scores, detects model drift, tracks model evolution, and delivers public climate intelligence services through a modern real-time analytics portal.

Built with **FastAPI**, **React**, **WebSockets**, **Protocol Buffers**, and **PostgreSQL**, this system ingests telemetry from distributed IoT devices and visualizes live insights through a modern dashboard.

Developed as part of the **MS in Professional Studies: Cybersecurity, IoT, and Data Management & Analytics** capstone at Rochester Institute of Technology (RIT), Spring 2026.

# 🚧 Project Status
This project is currently in active development and integration testing.

## Completed
- Protobuf ingestion pipeline
- FastAPI backend
- MQTT ingestion microservice
- PostgreSQL integration
- Device registry and authentication
- Unified climate risk scoring
- Climate Confidence Index (CCI)
- Model drift detection
- React dashboard architecture
- WebSocket streaming layer
- CI/CD workflows and Docker support

## In Progress
- WebSocket stabilization
- End-to-end production testing
- Deployment automation
- Advanced analytics refinement

---

# 🏗 System Architecture

## High‑Level Pipeline 

```text
┌──────────────────────────┐
│   LoRa Sensor Devices    │
└──────────────┬───────────┘
               │ LoRaWAN
               ▼
┌──────────────────────────┐
│   LoRa Gateway / Bridge  │
│ (TTN, ChirpStack, ESP32) │
└──────────────┬───────────┘
               │ MQTT publish
               ▼
┌──────────────────────────┐
│ MQTT Broker (Mosquitto)  │
└──────────────┬───────────┘
               │ subscribe
               ▼
┌──────────────────────────────────────┐
│ MQTT Ingestion Microservice          │
│ (Python, paho-mqtt, httpx)           │
│ - Converts MQTT → REST               │
│ - Buffers on failure                 │
│ - Retries delivery                   │
└──────────────┬───────────────────────┘
               │ POST /ingest/iot-reading
               ▼
┌──────────────────────────────────────┐
│ FastAPI Backend                      │
│ - Device registry                    │
│ - Risk scoring                       │
│ - Climate Confidence Index (CCI)     │
│ - Drift detection                    │
│ - Model evolution tracking           │
│ - PostgreSQL storage                 │
│ - WebSocket live feed                │
│ - Public subscription service        │
└──────────────┬───────────────────────┘
               │ WebSocket
               ▼
┌──────────────────────────────────────┐
│ React Portal (Vite)                  │
│ - Live dashboard                     │
│ - Timelines and clusters             │
│ - Animated transitions               │
│ - Drift panel and model timeline     │
│ - Public portal and subscriber UI    │
└──────────────────────────────────────┘

 Mermaid Architecture Diagram

```mermaid
flowchart LR
    A[LoRa Sensor Devices] -->|LoRaWAN| B[LoRa Gateway / TTN / ChirpStack]
    B -->|MQTT publish| C[MQTT Broker (Mosquitto)]
    C -->|subscribe| D[MQTT Ingestion Microservice<br/>(paho-mqtt, httpx)]
    D -->|POST /ingest/iot-reading| E[FastAPI Backend<br/>Risk • CCI • Drift • Registry • DB]
    E -->|WebSocket| F[React Portal (Vite)<br/>Dashboard • Clusters • Drift • Public Portal]

 Repository Structure
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── websocket/
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── mqtt_ingestor/
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── portal/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── firmware/
├── analytics/
├── docker-compose.yml
└── README.md

Telemetry Format (Protocol Buffers)
Devices send compact Protobuf messages containing:
• 	device_id
• 	timestamp_ms
• 	temperature_c
• 	humidity_pct
• 	battery_mv
• 	latitude, longitude
• 	is_virtual_device
• 	status (online/offline)
The backend decodes, validates, stores, and broadcasts updates to the dashboard.

Running Locally
Clone Repository: 
git clone https://github.com/luciependesi/Climate_Risk_Intelligence_LP.git
cd Climate_Risk_Intelligence_LP

Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
cd portal
npm install
npm start

Dashboard available at: http://localhost:3000

Docker Deployment
Running with Docker
docker compose up --build

This launches:
- FastAPI backend
- PostgreSQL database
- React frontend

Testing
pytest backend/tests
flake8 backend

🔐 Security
- JWT authentication (optional)
- RLS policies for multi‑tenant access
- HTTPS recommended in production
- MQTT credentials recommended
- HMAC‑SHA256 signature verification
- Schema version validation
- Audit logging and integrity checks

 🛣 Roadmap
- Advanced climate risk scoring
- Satellite weather API integration
- Device anomaly detection
- User authentication (JWT)
- Multi‑tenant organization support
- Cloud deployment (Azure / AWS)

Acknowledgments
Developed as part of the MS in Professional Studies: Cybersecurity, IoT, and Data Management & Analytics at Rochester Institute of Technology, Spring 2026.

Releases
Latest stable release: v1.0.0
Download:
https://github.com/luciependesi/Climate_Risk_Intelligence_LP/releases

License
This project is licensed under the MIT License.
See the LICENSE file for full terms.
© 2026 Lucie Pendesi. All rights reserved.