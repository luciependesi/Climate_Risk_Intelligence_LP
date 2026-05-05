# websocket manager for managing active connections and broadcasting messages to clients.
# app/websocket/manager.py

class ConnectionManager:
    def __init__(self):
        self.active = []

    async def connect(self, websocket):
        await websocket.accept()
        self.active.append(websocket)

    def disconnect(self, websocket):
        if websocket in self.active:
            self.active.remove(websocket)

    async def broadcast(self, message: dict):
        for ws in self.active:
            await ws.send_json(message)


manager = ConnectionManager()