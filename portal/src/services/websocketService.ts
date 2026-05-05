export function connectWS(path: string) {
  return new WebSocket(`ws://localhost:8000${path}`);
}