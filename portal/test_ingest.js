import fetch from "node-fetch";

const API_URL = "http://localhost:8000/ingest/ingest/sensor";

async function sendReading() {
  const payload = {
    device_id: "device-1",
    temperature: (20 + Math.random() * 10).toFixed(2),
    humidity: (30 + Math.random() * 30).toFixed(2),
    pm25: (5 + Math.random() * 45).toFixed(2),
    co2: (350 + Math.random() * 550).toFixed(2),
    health: (0.7 + Math.random() * 0.3).toFixed(2),
    risk_score: (0.1 + Math.random() * 0.8).toFixed(2),
    confidence: (0.5 + Math.random() * 0.5).toFixed(2),
    timestamp: new Date().toISOString()
  };

  console.log("Sending:", payload);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}

setInterval(sendReading, 2000);