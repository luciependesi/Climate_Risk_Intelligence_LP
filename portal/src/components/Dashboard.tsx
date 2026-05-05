// main dashboard page, showing all the components together and managing state for selected device, search, and filter.
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

// ⭐ NEW: Cluster Map
import { ClusterMap } from "../components/ClusterMap";

export function Dashboard() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <>
      <Breadcrumbs />
      <HeaderActions onSearch={setSearch} onFilter={setFilter} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1.5fr 1.5fr",
          gap: 16,
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DeviceOverviewPanel
            selectedDeviceId={selectedDeviceId}
            onSelect={setSelectedDeviceId}
          />
          <ClusterRiskPanel />
        </div>

        {/* MIDDLE COLUMN */}
        <AnimatedContainer keyId={selectedDeviceId ?? "none"}>
          <RiskGauge deviceId={selectedDeviceId ?? ""} />
          <HourlyAQIChart deviceId={selectedDeviceId ?? ""} />
        </AnimatedContainer>

        {/* RIGHT COLUMN — ⭐ Cluster Map replaces DeviceMap */}
        <AnimatedContainer keyId={(selectedDeviceId ?? "none") + "-daily"}>
          <DailyEnvChart deviceId={selectedDeviceId ?? ""} />

          <div style={{ height: "420px", borderRadius: 8, overflow: "hidden" }}>
            <ClusterMap
              onSelectDevice={(device) => setSelectedDeviceId(String(device.id))}
            />
          </div>
        </AnimatedContainer>
      </div>

      {/* Drawer opens when a device is selected */}
      <DeviceDrawer
        deviceId={selectedDeviceId}
        onClose={() => setSelectedDeviceId(null)}
      />

      <FAB icon="🔄" onClick={() => window.location.reload()} />
    </>
  );
}