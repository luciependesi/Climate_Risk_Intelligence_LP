// src/pages/CompareDevicesPage.jsx
import React, { useState } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import DeviceOverviewCard from "../components/DeviceOverviewCard";
import RiskTimelineChart from "../components/RiskTimelineChart";
import DeviceHealthTimeline from "../components/DeviceHealthTimeline";
import RiskTrendCard from "../components/RiskTrendCard";

export default function CompareDevicesPage() {
  const { devices, deviceIds } = useDeviceContext();
  const [leftId, setLeftId] = useState(deviceIds[0] || null);
  const [rightId, setRightId] = useState(deviceIds[1] || null);

  if (deviceIds.length < 2) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Need at least two devices online to compare.
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-2xl font-semibold">Compare Devices</h2>

      {/* Device selectors */}
      <div className="flex space-x-4">
        <select
          className="border p-2 rounded"
          value={leftId}
          onChange={(e) => setLeftId(e.target.value)}
        >
          {deviceIds.map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={rightId}
          onChange={(e) => setRightId(e.target.value)}
        >
          {deviceIds.map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <DeviceOverviewCard deviceId={leftId} />
          <RiskTrendCard deviceId={leftId} />
          <RiskTimelineChart deviceId={leftId} />
          <DeviceHealthTimeline deviceId={leftId} />
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <DeviceOverviewCard deviceId={rightId} />
          <RiskTrendCard deviceId={rightId} />
          <RiskTimelineChart deviceId={rightId} />
          <DeviceHealthTimeline deviceId={rightId} />
        </div>
      </div>
    </div>
  );
}