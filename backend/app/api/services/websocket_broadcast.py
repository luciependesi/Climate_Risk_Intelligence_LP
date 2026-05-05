# app/websocket_broadcast.py
from typing import Set
from fastapi import WebSocket
import json

class WebSocketManager:
    def __init__(self):
        self.active: Set[WebSocket] = set()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.add(ws)

    def disconnect(self, ws: WebSocket):
        self.active.discard(ws)

    async def broadcast(self, message: dict):
        """Broadcast raw dict messages (UI expects this)."""
        data = json.dumps(message)
        for ws in list(self.active):
            try:
                await ws.send_text(data)
            except Exception:
                self.disconnect(ws)

    async def broadcast_event(self, event):
        """Existing protobuf LiveEvent support."""
        data = event.model_json()
        for ws in list(self.active):
            try:
                await ws.send_text(data)
            except Exception:
                self.disconnect(ws)

ws_manager = WebSocketManager()