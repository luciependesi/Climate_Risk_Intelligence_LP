// src/pages/DeviceDetailPage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDeviceContext } from "../context/DeviceContext";

import DeviceOverviewCard from "../components/DeviceOverviewCard";
import RiskTimelineChart from "../components/RiskTimelineChart";
import DeviceHealthTimeline from "../components/DeviceHealthTimeline";
import RiskTrendCard from "../components/RiskTrendCard";
import AlertsPanel from "../components/AlertsPanel";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const {
    devices,
    setSelectedDeviceId,
    selectedDeviceId,
  } = useDeviceContext();

  // Sync URL param with global selection
  useEffect(() => {
    if (id && id !== selectedDeviceId) {
      setSelectedDeviceId(id);
    }
  }, [id, selectedDeviceId]);

  const device = devices[id];

  if (!device) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Device not found or offline.
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-2xl font-semibold">Device: {id}</h2>

      <DeviceOverviewCard deviceId={id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskTimelineChart deviceId={id} />
        <DeviceHealthTimeline deviceId={id} />
        <RiskTrendCard deviceId={id} />
      </div>

      <AlertsPanel deviceId={id} />
    </div>
  );
}