//this component calculates the avarage risk accross all devices in the cluster and displays it with a color code (green, orange,red)
// src/components/ClusterRiskPanel.tsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import AnimatedContainer from "./AnimatedContainer";
import { useAllDeviceRisk } from "../hooks/useAllDeviceRisk";

export function ClusterRiskPanel() {
  const { devices } = useDeviceContext();

  // ⭐ Filter out invalid IDs
  const deviceIds =
    devices
      ?.map((d) => d.id)
      .filter((id) => typeof id === "string" && id.length > 0) ?? [];

  const { data } = useAllDeviceRisk(deviceIds);

  const riskValues =
    data?.map((entry) => entry.data?.[0]?.risk ?? 0) ?? [];

  const avgRisk =
    riskValues.length > 0
      ? Math.round(
          riskValues.reduce((a, b) => a + b, 0) / riskValues.length
        )
      : 0;

  const color =
    avgRisk >= 80 ? "#cf1322" : avgRisk >= 50 ? "#fa8c16" : "#389e0d";

  return (
    <AnimatedContainer keyId="cluster-risk">
      <div className="card">
        <h3>Cluster Risk</h3>

        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color,
            marginBottom: 4,
          }}
        >
          {avgRisk}
        </div>

        <div style={{ opacity: 0.7 }}>
          Across {deviceIds.length} devices
        </div>
      </div>
    </AnimatedContainer>
  );
}

export default ClusterRiskPanel;