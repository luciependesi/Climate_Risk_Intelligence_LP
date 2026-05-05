//frontend/src/pages/Dashboard.tsx
import React, { useState } from "react";
import { DeviceOverviewGrid } from "../components/DeviceOverviewGrid";
import { RiskColorScale } from "../components/RiskColorScale";
import { DeviceSearchBar } from "../components/DeviceSearchBar";
import { LiveAlertsPanel } from "../components/LiveAlertsPanel";

import { useSensorData } from "../hooks/useSensorData";
import { RiskGauge } from "../components/RiskGauge";
import { SensorCard } from "../components/SensorCard";

export default function Dashboard() {
  const mode: "mock" | "live" = "mock"; // or from global state
  const deviceId = "esp32_001";

  const { data, loading, error, riskScore, prevRiskScore } =
    useSensorData(mode, deviceId, 6000);

  return (
    <div className="dashboard-grid">
      <RiskGauge
        score={riskScore}
        previous={prevRiskScore}
        loading={loading}
      />

      <SensorCard
        title="Temperature"
        value={data?.temperature_c}
        unit="°C"
        loading={loading}
      />

      <SensorCard
        title="Humidity"
        value={data?.humidity_percent}
        unit="%"
        loading={loading}
      />

      <SensorCard
        title="Pressure"
        value={data?.pressure_hpa}
        unit="hPa"
        loading={loading}
      />
    </div>
    <div>
      <RiskColorScale />
      <DeviceSearchBar onChange={setFilter} />
      <LiveAlertsPanel />
      <DeviceOverviewGrid filter={filter} />
    </div>
    );
};