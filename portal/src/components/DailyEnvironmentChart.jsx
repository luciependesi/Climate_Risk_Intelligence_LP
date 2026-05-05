//shows a line chart of the last 48 readings of temperature, humidity, and pressure for a given device ID.
import React, { useEffect, useState } from "react";

export default function DailyEnvironmentChart({ deviceId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    async function fetchHistory() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/sensor/history?device_id=${deviceId}&limit=48`
        );
        if (!res.ok) return;

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch environment history:", err);
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [deviceId]);

  if (history.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Daily Environment</h3>
        <p className="text-gray-400 italic">No readings yet.</p>
      </div>
    );
  }

  const temps = history.map((h) => h.temperature_c ?? 0);
  const hums = history.map((h) => h.humidity ?? 0);
  const press = history.map((h) => h.pressure_hpa ?? 0);

  const max = Math.max(...temps, ...hums, ...press, 1);
  const min = Math.min(...temps, ...hums, ...press, 0);

  const makePoints = (arr) =>
    arr
      .map((v, i) => {
        const x = (i / (arr.length - 1)) * 300;
        const y = 100 - ((v - min) / (max - min)) * 100;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Daily Environment</h3>

      <svg width="300" height="100" className="border rounded">
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          points={makePoints(temps)}
          style={{ transition: "all 0.6s ease" }}
        />
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={makePoints(hums)}
          style={{ transition: "all 0.6s ease" }}
        />
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points={makePoints(press)}
          style={{ transition: "all 0.6s ease" }}
        />
      </svg>
    </div>
  );
}