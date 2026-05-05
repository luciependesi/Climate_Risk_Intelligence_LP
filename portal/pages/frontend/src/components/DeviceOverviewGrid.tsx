//all nodes
import React from "react";
import { useDevices } from "../api/useDevices";
import { LiveDeviceCard } from "./LiveDeviceCard";
import { SkeletonLoader } from "./SkeletonLoader";

export const DeviceOverviewGrid: React.FC<{ filter?: string }> = ({ filter }) => {
  const { devices, loading } = useDevices();

  if (loading)
    return (
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLoader key={i} height={140} />
        ))}
      </div>
    );

  const filtered = devices.filter((d) =>
    d.device_id.toLowerCase().includes(filter?.toLowerCase() ?? "")
  );

  return (
    <div className="grid">
      {filtered.map((d) => (
        <LiveDeviceCard key={d.device_id} deviceId={d.device_id} />
      ))}
    </div>
  );
};