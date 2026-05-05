import { useState } from "react";

import { DeviceOverviewPanel } from "../components/DeviceOverviewPanel";
import { HourlyAQIChart } from "../components/HourlyAQIChart";
import { DailyEnvChart } from "../components/DailyEnvChart";
import { RiskGauge } from "../components/RiskGauge";
import { ClusterRiskPanel } from "../components/ClusterRiskPanel";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { HeaderActions } from "../components/HeaderActions";
import { DeviceDrawer } from "../components/DeviceDrawer";
import { FAB } from "../components/FAB";
import { AnimatedContainer } from "../components/AnimatedContainer";

// ⭐ Correct components
import { ClusterMap } from "../components/ClusterMap";
import { RiskTimelineChart } from "../components/RiskTimelineChart";

export function Dashboard() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <>
      <div className="breadcrumbs">
        <Breadcrumbs />
      </div>

      <div className="header-actions">
        <HeaderActions onSearch={setSearch} onFilter={setFilter} />
      </div>

      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="left-col">
          <div className="panel">
            <DeviceOverviewPanel
              selectedDeviceId={selectedDeviceId}
              onSelect={setSelectedDeviceId}
            />
          </div>

          <div className="panel">
            <ClusterRiskPanel />
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <AnimatedContainer
          keyId={selectedDeviceId ?? "none"}
          className="animated-container"
        >
          <div className="panel">
            <RiskGauge deviceId={selectedDeviceId ?? ""} />
          </div>

          <div className="panel">
            <HourlyAQIChart deviceId={selectedDeviceId ?? ""} />
          </div>

          {/* ⭐ Correct timeline component */}
          <div className="panel">
            <RiskTimelineChart deviceId={selectedDeviceId ?? ""} />
          </div>
        </AnimatedContainer>

        {/* RIGHT COLUMN */}
        <AnimatedContainer
          keyId={(selectedDeviceId ?? "none") + "-right"}
          className="animated-container"
        >
          <div className="panel">
            <DailyEnvChart deviceId={selectedDeviceId ?? ""} />
          </div>

          {/* ⭐ Correct map component */}
          <div className="map-container">
            <ClusterMap
              onSelectDevice={(device) =>
                setSelectedDeviceId(String(device.id))
              }
            />
          </div>
        </AnimatedContainer>
      </div>

      {/* Drawer */}
      <DeviceDrawer
        deviceId={selectedDeviceId}
        onClose={() => setSelectedDeviceId(null)}
      />

      <div className="fab" onClick={() => window.location.reload()}>
        🔄
      </div>
    </>
  );
}
export default Dashboard;