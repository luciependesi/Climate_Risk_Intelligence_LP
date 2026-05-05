import React, { useState } from "react";
import { LiveDeviceCard } from "../components/LiveDeviceCard";
import { RiskTimelineChart } from "../components/RiskTimelineChart";
import { DeviceSearchBar } from "../components/DeviceSearchBar";
import "./DeviceComparisonPage.css";

export const DeviceComparisonPage = () => {
  const [ids, setIds] = useState<string[]>([]);

  const addDevice = (id: string) => {
    if (!ids.includes(id)) setIds([...ids, id]);
  };

  return (
    <div>
      <h2>Compare Devices</h2>
      <DeviceSearchBar onSelect={addDevice} />

      <div className="compare-grid">
        {ids.map((id) => (
          <div key={id} className="compare-card">
            <LiveDeviceCard deviceId={id} />
            <RiskTimelineChart
              deviceId={id}
              startMs={Date.now() - 24 * 3600 * 1000}
              endMs={Date.now()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};