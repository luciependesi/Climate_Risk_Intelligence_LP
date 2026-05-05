import React from "react";
import { useDevices } from "../api/useDevices";
import { LiveDeviceCard } from "../components/LiveDeviceCard";
import "./ClusterViewPage.css";

function groupByRegion(devices: any[]) {
  const groups: Record<string, any[]> = {};

  devices.forEach((d) => {
    const region = `${Math.round(d.latitude * 10) / 10},${Math.round(
      d.longitude * 10
    ) / 10}`;

    if (!groups[region]) groups[region] = [];
    groups[region].push(d);
  });

  return groups;
}

export const ClusterViewPage = () => {
  const { devices, loading } = useDevices();

  if (loading) return <div>Loading clusters…</div>;

  const clusters = groupByRegion(devices);

  return (
    <div className="cluster-container">
      {Object.entries(clusters).map(([region, group]) => (
        <div key={region} className="cluster">
          <h3>Region {region}</h3>
          <div className="cluster-grid">
            {group.map((d) => (
              <LiveDeviceCard key={d.device_id} deviceId={d.device_id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};