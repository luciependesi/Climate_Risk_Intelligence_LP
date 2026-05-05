import { useEffect, useState } from "react";

export function useClusterWS() {
  const [avgRisk, setAvgRisk] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/cluster");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      setAvgRisk(data.avg_risk);
    };

    return () => ws.close();
  }, []);

  return avgRisk;
}