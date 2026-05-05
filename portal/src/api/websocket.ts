export function createWebSocket(path: string) {
  return new WebSocket(`ws://localhost:8000${path}`);
}