//WebSocket + history
import React, { useMemo } from "react";
import { useHistory } from "../api/useHistory";
import { useLiveRiskStream } from "../api/useLiveRiskStream";

interface Props {
  deviceId: string;
  startMs: number;
  endMs: number;
}

export const RiskTimelineChart: React.FC<Props> = ({
  deviceId,
  startMs,
  endMs,
}) => {
  const { data, loading } = useHistory(deviceId, startMs, endMs);
  const { latest } = useLiveRiskStream(deviceId);

  const points = useMemo(() => {
    const base = data.map((r) => ({
      x: r.timestamp_ms,
      y: r.temperature_c, // or computed risk if you store it
    }));
    if (latest) {
      base.push({ x: latest.timestamp_ms, y: latest.overall_risk * 100 });
    }
    return base.sort((a, b) => a.x - b.x);
  }, [data, latest]);

  if (loading) return <div>Loading timeline…</div>;
  if (!points.length) return <div>No data</div>;

  const minX = points[0].x;
  const maxX = points[points.length - 1].x;
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  const norm = (v: number, min: number, max: number) =>
    max === min ? 0.5 : (v - min) / (max - min);

  const path = points
    .map((p, i) => {
      const x = norm(p.x, minX, maxX) * 100;
      const y = 100 - norm(p.y, minY, maxY) * 100;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="risk-timeline">
      <path d={path} fill="none" stroke="#ff4d4f" strokeWidth={1.5} />
    </svg>
  );
};
