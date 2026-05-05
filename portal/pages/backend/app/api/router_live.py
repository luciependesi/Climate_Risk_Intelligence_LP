from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter(tags=["live"])

reading_clients: List[WebSocket] = []
device_status_clients: List[WebSocket] = []


@router.websocket("/ws/readings")
async def ws_readings(ws: WebSocket):
    await ws.accept()
    reading_clients.append(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        reading_clients.remove(ws)


@router.websocket("/ws/devices")
async def ws_devices(ws: WebSocket):
    await ws.accept()
    device_status_clients.append(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        device_status_clients.remove(ws)


async def broadcast_reading(payload: dict):
    dead = []
    for ws in reading_clients:
        try:
            await ws.send_json(payload)
        except Exception:
            dead.append(ws)
    for ws in dead:
        reading_clients.remove(ws)


async def broadcast_device_status(payload: dict):
    dead = []
    for ws in device_status_clients:
        try:
            await ws.send_json(payload)
        except Exception:
            dead.append(ws)
    for ws in dead:
        device_status_clients.remove(ws)