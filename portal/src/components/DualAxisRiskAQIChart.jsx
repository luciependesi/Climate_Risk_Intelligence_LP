// src/components/charts/DualAxisRiskAQIChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts";

export default function DualAxisRiskAQIChart({ history }) {
  /* -------------------------------------------------------
     1. Empty state
  ------------------------------------------------------- */
  if (!history || history.length === 0) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "260px" }}
      >
        <h3 className="text-lg font-semibold mb-2">Risk + AQI Trend</h3>
        <p className="text-gray-400 italic">No data available.</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     2. Normalize + clean data
  ------------------------------------------------------- */
  const data = history.map((h) => ({
    time: new Date(h.timestamp_ms).toLocaleTimeString(),
    risk: h.risk_score_unified ?? 0,
    aqi: h.air_quality_raw ?? 0,
    ci_lower: h.ci_lower ?? null,
    ci_upper: h.ci_upper ?? null,
  }));

  /* -------------------------------------------------------
     3. Render chart
  ------------------------------------------------------- */
  return (
    <div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade"
      style={{ minHeight: "260px" }}
    >
      <h3 className="text-lg font-semibold mb-2">Risk + AQI Trend</h3>

      {/* ⭐ Stable container — prevents width(-1)/height(-1) */}
      <div style={{ width: "100%", height: "260px", minHeight: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="time" tick={{ fontSize: 10 }} />

            {/* Left axis: Risk */}
            <YAxis
              yAxisId="risk"
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="#e11d48"
            />

            {/* Right axis: AQI */}
            <YAxis
              yAxisId="aqi"
              orientation="right"
              domain={[0, 500]}
              tick={{ fontSize: 10 }}
              stroke="#3b82f6"
            />

            <Tooltip />

            {/* Confidence interval band */}
            <Area
              yAxisId="risk"
              type="monotone"
              dataKey="ci_upper"
              stroke="none"
              fill="rgba(59,130,246,0.15)"
            />
            <Area
              yAxisId="risk"
              type="monotone"
              dataKey="ci_lower"
              stroke="none"
              fill="white"
            />

            {/* Risk line */}
            <Line
              yAxisId="risk"
              type="monotone"
              dataKey="risk"
              stroke="#e11d48"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />

            {/* AQI line */}
            <Line
              yAxisId="aqi"
              type="monotone"
              dataKey="aqi"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}