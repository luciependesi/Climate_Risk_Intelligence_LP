// src/components/charts/AirQualityChart.jsx
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

export default function AirQualityChart() {
  const { history, isVirtual } = useDeviceContext();

  /* -------------------------------------------------------
     1. Normalize + clean data
  ------------------------------------------------------- */
  const data =
    history?.map((d) => ({
      timestamp: new Date(d.timestamp_ms || d.timestamp).toLocaleTimeString(),
      value:
        d.air_quality_raw !== null && d.air_quality_raw !== undefined
          ? d.air_quality_raw
          : null,
    })) || [];

  /* -------------------------------------------------------
     2. Empty state
  ------------------------------------------------------- */
  if (!data || data.length === 0) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "260px" }}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Air Quality (Raw)
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No air quality data.</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     3. Render chart
  ------------------------------------------------------- */
  return (
    <div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade"
      style={{ minHeight: "260px" }}
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        Air Quality (Raw)
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      {/* ⭐ Stable container — prevents width(-1)/height(-1) */}
      <div style={{ width: "100%", height: "260px", minHeight: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5722" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#ff5722" stopOpacity={0} />
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
                dataKey="value"
                fill="url(#aqiGradient)"
                stroke="none"
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke={isVirtual ? "#ff9800" : "#4caf50"}
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