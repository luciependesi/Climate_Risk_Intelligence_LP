// A simple mock WebSocket server that simulates live sensor readings from two devices.
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8001 });
console.log("Mock WebSocket server running on ws://localhost:8001/ws/live");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function makeReading(deviceId) {
  return {
    type: "reading",
    reading: {
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      temperature_c: random(20, 26),
      humidity: random(40, 60),
      pressure_hpa: random(1008, 1014),
      mq135_ppm: random(120, 240),
      water_level: random(10, 20),
      battery_v: random(3.4, 3.8),
      rssi: -Math.floor(random(55, 80)),
      latitude: 40.44 + random(-0.01, 0.01),
      longitude: -79.99 + random(-0.01, 0.01)
    }
  };
}

setInterval(() => {
  const payloads = [
    makeReading("device_1"),
    makeReading("device_2")
  ];

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      payloads.forEach((p) => client.send(JSON.stringify(p)));
    }
  });
}, 1000);