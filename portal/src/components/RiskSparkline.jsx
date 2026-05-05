// RiskSparkline.jsx
import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function RiskSparkline({ history }) {
  if (!history || history.length === 0) return null;

  const data = history.map((h) => ({
    risk: h.risk_score_unified,
  }));

  return (
    <div style={{ width: "100%", height: 40 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#e11d48"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}