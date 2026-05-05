// A custom hook to subscribe to live MQTT data for a given device ID.
import { useEffect, useRef, useState } from "react";

export function useLiveMQTT(deviceId, mode = "live") {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  const base =
    mode === "live"
      ? "http://localhost:8000/api"
      : "/mock";

  // Poll fallback
  async function pollLatest() {
    try {
      const res = await fetch(`${base}/sensor/latest?device_id=${deviceId}`);
      if (!res.ok) return;
      const data = await res.json();
      setLatest(data);
    } catch {}
  }

  useEffect(() => {
    if (mode === "mock") {
      pollLatest();
      return;
    }

    new WebSocket("ws://localhost:8000/ws");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type !== "reading") return;
      if (msg.reading.device_id !== deviceId) return;

      setLatest(msg.reading);
      setHistory((prev) => [...prev.slice(-99), msg.reading]);
    };

    ws.onclose = () => {
      console.warn("WS closed — reconnecting in 2s");
      setTimeout(() => {
        if (wsRef.current === ws) wsRef.current = null;
      }, 2000);
    };

    return () => ws.close();
  }, [deviceId, mode]);

  return { latest, history };
}