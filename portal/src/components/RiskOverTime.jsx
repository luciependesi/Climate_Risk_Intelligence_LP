// this component fetches the risk history for a given device and displays it as a line graph.
import React, { useEffect, useState } from "react";

export default function RiskOverTime({ deviceId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    async function fetchHistory() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/sensor/history?device_id=${deviceId}&limit=50`
        );
        if (!res.ok) return;

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch risk history:", err);
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [deviceId]);

  if (history.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Risk Over Time</h3>
        <p className="text-gray-400 italic">No readings yet.</p>
      </div>
    );
  }

  // Extract risk values
  const points = history.map((h) => h.risk_score || 0);

  // Normalize for SVG
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);

  const svgPoints = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * 300;
      const y = 100 - ((v - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Risk Over Time</h3>

      <svg width="300" height="100" className="border rounded">
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={svgPoints}
        />
      </svg>
    </div>
  );
}