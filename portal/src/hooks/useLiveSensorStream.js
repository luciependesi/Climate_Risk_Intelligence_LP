//This hook connects to the websocket endpoint to receive live sensor data and updates the state with the latest data.
import { useEffect, useState } from "react";

export function useLiveSensorStream() {
  const [data, setData] = useState(null);

  useEffect(() => {
    new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // 🔥 Normalize device_id to string
      if (msg?.reading?.device_id !== undefined) {
        msg.reading.device_id = String(msg.reading.device_id);
      }

      setData(msg);
    };

    return () => ws.close();
  }, []);

  return data;
}