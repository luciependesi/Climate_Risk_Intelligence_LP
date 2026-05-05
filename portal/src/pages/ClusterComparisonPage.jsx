// src/pages/ClusterComparisonPage.jsx
import React from "react";
import { useMultiClusterRisk } from "../hooks/useMultiClusterRisk";
import ClusterRiskCard from "../components/ClusterRiskCard";

const CLUSTERS = ["north", "south", "east", "west"];

export default function ClusterComparisonPage() {
  const { data, isLoading } = useMultiClusterRisk(CLUSTERS);
  if (isLoading) return <div>Loading…</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <h2>Cluster Comparison</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {data.map(({ id, data: d }) => (
          <div key={id}>
            <h4 style={{ marginBottom: 8 }}>{id.toUpperCase()}</h4>
            <ClusterRiskCard
              avgRisk={d.avg_risk}
              deviceCount={d.device_count}
              trend={d.trend}
            />
          </div>
        ))}
      </div>
    </div>
  );
}