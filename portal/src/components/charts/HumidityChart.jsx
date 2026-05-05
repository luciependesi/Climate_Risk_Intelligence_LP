// src/components/charts/HumidityChart.jsx
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

export default function HumidityChart() {
  const { smoothedHumidity, isVirtual } = useDeviceContext();

  /* -------------------------------------------------------
     1. Empty state
  ------------------------------------------------------- */
  if (!smoothedHumidity || smoothedHumidity.length === 0) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "260px" }}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Humidity (%)
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No humidity data.</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     2. Render chart
  ------------------------------------------------------- */
  return (
    <div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade"
      style={{ minHeight: "260px" }}
    >
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        Humidity (%)
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      {/* ⭐ Stable container — prevents width(-1)/height(-1) */}
      <div style={{ width: "100%", height: "260px", minHeight: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={smoothedHumidity}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#03a9f4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#03a9f4" stopOpacity={0} />
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
                dataKey="smoothed"
                fill="url(#humidityGradient)"
                stroke="none"
              />
            )}

            <Line
              type="monotone"
              dataKey="smoothed"
              stroke={isVirtual ? "#03a9f4" : "#4caf50"}
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