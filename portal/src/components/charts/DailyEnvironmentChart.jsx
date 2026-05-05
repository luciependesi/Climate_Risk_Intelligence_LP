// src/components/charts/DailyEnvironmentChart.jsx
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

import { useDeviceContext } from "../../context/DeviceContext";
import VirtualBadge from "../VirtualBadge";

export default function DailyEnvironmentChart() {
  const {
    smoothedTemperature,
    smoothedHumidity,
    smoothedPressure,
    isVirtual,
  } = useDeviceContext();

  /* -------------------------------------------------------
     1. Merge streams safely
  ------------------------------------------------------- */
  const merged = (smoothedTemperature || []).map((t, i) => ({
    timestamp: t.timestamp,
    temp: t.smoothed ?? null,
    humidity: smoothedHumidity?.[i]?.smoothed ?? null,
    pressure: smoothedPressure?.[i]?.smoothed ?? null,
  }));

  /* -------------------------------------------------------
     2. Empty state
  ------------------------------------------------------- */
  if (!merged || merged.length === 0) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "300px" }}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Daily Environmental Trends
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No environmental data.</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     3. Render chart
  ------------------------------------------------------- */
  return (
    <div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade"
      style={{ minHeight: "300px" }}
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        Daily Environmental Trends
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      {/* ⭐ Stable container — prevents width(-1)/height(-1) */}
      <div style={{ width: "100%", height: "300px", minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged}>
            <defs>
              <linearGradient id="envGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9800" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ff9800" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="timestamp" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />

            {/* Confidence shading for virtual devices */}
            {isVirtual && (
              <Area
                type="monotone"
                dataKey="temp"
                fill="url(#envGradient)"
                stroke="none"
              />
            )}

            {/* Temperature */}
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ff9800"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!isVirtual}
            />

            {/* Humidity */}
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#03a9f4"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!isVirtual}
            />

            {/* Pressure */}
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#9c27b0"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!isVirtual}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}