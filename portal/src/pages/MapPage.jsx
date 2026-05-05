//Spatial Clustering Map
// src/pages/MapPage.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import DeviceMap from "../components/DeviceMap";
import AnimatedContainer from "../components/AnimatedContainer";
import DashboardSkeleton from "../components/DashboardSkeleton";

export default function MapPage() {
  const { deviceIds } = useDeviceContext();

  const isLoading = deviceIds.length === 0;

  return (
    <div style={{ padding: "20px", maxWidth: 1400, margin: "0 auto" }}>
      <AnimatedContainer delay={50}>
        <h2 style={{ marginBottom: 10 }}>Device Map</h2>
        <p style={{ marginTop: 0, marginBottom: 20, color: "#666" }}>
          View all live devices on the map. Click a marker to inspect device
          details, risk levels, and environmental readings.
        </p>
      </AnimatedContainer>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <AnimatedContainer delay={120}>
          <DeviceMap />
        </AnimatedContainer>
      )}
    </div>
  );
}