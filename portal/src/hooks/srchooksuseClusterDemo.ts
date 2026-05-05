import { useEffect, useState } from "react";
import mockCluster from "../mock/cluster.json";

export function useClusterDemo() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % 20);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const spike = Math.sin((frame / 20) * Math.PI) * 60; // 0 → 60 → 0
  const avg_risk = Math.round(mockCluster.avg_risk + spike);

  const per_device = mockCluster.per_device.map((d) => ({
    ...d,
    risk: Math.round(d.risk + spike)
  }));

  const trend = mockCluster.trend.map((p, i) => ({
    ...p,
    risk: Math.round(p.risk + (i / mockCluster.trend.length) * spike)
  }));

  return {
    avg_risk,
    device_count: mockCluster.device_count,
    per_device,
    trend
  };
}