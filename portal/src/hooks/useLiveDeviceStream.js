//Hook to subscribe to a live stream of divice readings.
// Hook to subscribe to a live stream of device readings.
import { useEffect, useRef, useState } from "react";

export function useLiveDeviceStream(deviceId) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!deviceId) return;

    // ✔ Correct backend endpoint
   new WebSocket("ws://localhost:8000/ws");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // ✔ Correct message shape
      if (data.type !== "reading") return;
      if (data.device_id !== deviceId) return;

      setLatest(data);
      setHistory((prev) => [...prev.slice(-99), data]);
    };

    ws.onclose = () => {
      console.warn("WebSocket closed — attempting reconnect in 2s");
      setTimeout(() => {
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
      }, 2000);
    };

    return () => ws.close();
  }, [deviceId]);

  return { latest, history };
}