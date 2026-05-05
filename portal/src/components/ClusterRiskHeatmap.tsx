// src/components/ClusterRiskHeatmap.tsx
import React from "react";

type DeviceRisk = {
  device_id: string;
  risk: number;
};

type Props = {
  devices: DeviceRisk[];
};

function riskColor(risk: number) {
  if (risk >= 80) return "#cf1322";
  if (risk >= 50) return "#fa8c16";
  return "#389e0d";
}

export default function ClusterRiskHeatmap({ devices }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: 8,
      }}
    >
      {devices.map((d) => (
        <div
          key={d.device_id}
          style={{
            padding: 8,
            borderRadius: 8,
            background: riskColor(d.risk),
            color: "#fff",
            fontSize: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {d.device_id}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{d.risk}</div>
        </div>
      ))}
    </div>
  );
}