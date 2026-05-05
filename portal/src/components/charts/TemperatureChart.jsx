// src/components/charts/TemperatureChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

import { rollingAverage } from "../../utils/smoothing";

export default function TemperatureChart({ data, isVirtual }) {
  /* -------------------------------------------------------
     1. Normalize + smooth data
  ------------------------------------------------------- */
  const cleaned = (data || [])
    .filter((d) => d.temperature_c !== null && d.temperature_c !== undefined)
    .map((d) => ({
      timestamp: new Date(d.timestamp_ms || d.timestamp).toLocaleTimeString(),
      value: d.temperature_c,
    }));

  const smoothed = rollingAverage(cleaned, 5).map((d) => ({
    ...d,
    smoothed: d.value,
  }));

  /* -------------------------------------------------------
     2. Empty state
  ------------------------------------------------------- */
  if (!smoothed || smoothed.length === 0) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "260px" }}
      >
        <h3 className="text-lg font-semibold mb-2">Temperature</h3>
        <p className="text-gray-400 italic">No temperature data.</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     3. Render chart
  ------------------------------------------------------- */
  return (
    <div style={{ width: "100%", height: "260px", minHeight: "260px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={smoothed}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9800" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ff9800" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="timestamp" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />

          {/* Confidence shading for virtual data */}
          {isVirtual && (
            <Area
              type="monotone"
              dataKey="smoothed"
              fill="url(#tempGradient)"
              stroke="none"
            />
          )}

          <Line
            type="monotone"
            dataKey="smoothed"
            stroke={isVirtual ? "#ff9800" : "#4caf50"}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!isVirtual}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}