# © 2026 Lucie Pendesi. All rights reserved.
# Licensed under the MIT License. See the LICENSE file for details.
# app/api/websocket.py
print("🔥 WEBSOCKET FILE LOADED")
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.api.websocket_manager import ws_manager

router = APIRouter()

@router.websocket("/ws/live/devices")
async def websocket_devices(ws: WebSocket):
    await ws.accept()
    print("✅ WS CONNECTED")

    await ws_manager.connect(ws)

    try:
        await ws.send_json({"status": "connected"})

        while True:
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        print("❌ WS DISCONNECTED")
        ws_manager.disconnect(ws)