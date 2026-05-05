import { useEffect, useRef, useState } from "react";

export function useLiveRiskStream(deviceId: string) {
  const [latest, setLatest] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = `ws://localhost:8000/ws/${deviceId}`;
    let ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLatest(data);
      } catch (e) {
        console.error("Invalid WS message", e);
      }
    };

    ws.onclose = () => {
      console.warn("WS closed, reconnecting in 1s...");
      setTimeout(() => {
        wsRef.current = new WebSocket(url);
      }, 1000);
    };

    return () => {
      ws.close();
    };
  }, [deviceId]);

  return { latest };
}