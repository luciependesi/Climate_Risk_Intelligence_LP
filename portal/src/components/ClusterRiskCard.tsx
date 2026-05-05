// src/components/ClusterRiskCard.tsx
import React from "react";
import ClusterRiskGauge from "./ClusterRiskGauge";
import ClusterRiskSparkline from "./ClusterRiskSparkline";

type Props = {
  avgRisk: number;
  deviceCount: number;
  trend: { t: string; risk: number }[];
};

function bgColor(risk: number) {
  if (risk >= 80) return "rgba(207,19,34,0.12)";
  if (risk >= 50) return "rgba(250,140,22,0.12)";
  return "rgba(56,158,13,0.12)";
}

export default function ClusterRiskCard({ avgRisk, deviceCount, trend }: Props) {
  return (
    <div
      className="card"
      style={{
        background: bgColor(avgRisk),
        borderRadius: 12,
        padding: 16,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 16,
        alignItems: "center",
      }}
    >
      <ClusterRiskGauge value={avgRisk} />

      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Cluster Risk</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
          Averaged across {deviceCount} devices
        </div>
        <ClusterRiskSparkline data={trend} />
      </div>
    </div>
  );
}