# app/api/websocket.py
# app/api/websocket.py
print("🔥 WEBSOCKET FILE LOADED")
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.api.websocket_manager import ws_manager

router = APIRouter()

@router.websocket("/ws/devices")
async def websocket_devices(ws: WebSocket):
    await ws.accept()
    print("✅ WS CONNECTED")

    await ws_manager.connect(ws)

    try:
        # Send initial handshake
        await ws.send_json({"status": "connected"})

        while True:
            # 🔥 IMPORTANT: actively receive (keeps connection alive)
            await ws.receive_text()

    except WebSocketDisconnect:
        print("❌ WS DISCONNECTED")
        ws_manager.disconnect(ws)