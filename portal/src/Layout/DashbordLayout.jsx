import { useEffect, useState } from "react";

export function useLiveReadings() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLatest(data);
    };
    return () => ws.close();
  }, []);

  return latest;
}