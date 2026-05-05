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
import { useDeviceContext } from "../../context/DeviceContext";

export default function TemperatureChart() {
  const { smoothedTemperature, isVirtual } = useDeviceContext();

  return (
    <div className="card">
      <h3 className="card-title">
        Temperature (°C)
        {isVirtual && (
          <span className="badge-virtual">VIRTUAL</span>
        )}
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={smoothedTemperature}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9800" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ff9800" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="timestamp" />
          <YAxis />

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
          />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}