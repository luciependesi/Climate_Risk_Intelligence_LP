// src/components/ClusterRiskSparkline.tsx
import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: { t: string; risk: number }[];
};

export default function ClusterRiskSparkline({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 80 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            formatter={(v: any) => [`${v}`, "Risk"]}
            labelFormatter={(l) => `Time: ${l}`}
          />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#cf1322"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}