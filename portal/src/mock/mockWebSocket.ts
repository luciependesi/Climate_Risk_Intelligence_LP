export function createMockWebSocket(callback: (msg: any) => void) {
  setInterval(() => {
    callback({
      device_id: "mock",
      timestamp_ms: Date.now(),
      temperature_c: 20 + Math.random() * 5,
      humidity_pct: 40 + Math.random() * 20,
    });
  }, 1000);
}