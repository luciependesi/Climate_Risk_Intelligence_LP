// A custom hook to connect to the live stream websocket and receive data in real-time. It sets up a websocket.
import { useEffect, useState } from "react";

export function useLiveStream() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/live");

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => ws.close();
  }, []);

  return data;
}