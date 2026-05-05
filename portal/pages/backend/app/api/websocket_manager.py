class WSManager:
    def __init__(self):
        self.connections = []

    async def connect(self, ws):
        self.connections.append(ws)
        print("👥 Connected:", len(self.connections))

    def disconnect(self, ws):
        if ws in self.connections:
            self.connections.remove(ws)

    async def broadcast(self, data):
        print("📤 Broadcasting:", data)
        for conn in list(self.connections):
            try:
                await conn.send_json(data)
            except:
                self.disconnect(conn)

ws_manager = WSManager()