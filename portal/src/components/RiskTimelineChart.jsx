// this component fetches the risk history for a given device and renders a simple line chart using SVG.
// src/components/RiskTimelineChart.jsx
// RiskTimelineChart.jsx

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

export function RiskTimelineChart({ deviceId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    async function fetchHistory() {
      try {
        const res = await fetch(`/api/devices/${deviceId}/risk-history`);
        const data = await res.json();
        setHistory(data || []);
      } catch (err) {
        console.error("Timeline fetch error:", err);
      }
    }

    fetchHistory();
  }, [deviceId]);

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={history}>
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 100]} />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="risk"
            stroke="#2563eb"
            fill="#93c5fd"
            fillOpacity={0.3}
          />

          <Line
            type="monotone"
            dataKey="risk"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}