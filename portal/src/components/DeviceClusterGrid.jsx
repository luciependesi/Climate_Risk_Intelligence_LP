import React from "react";
import { useLiveDevices } from "../hooks/useLiveDevices";
import { clusterDevices } from "../utils/clusterDevices";
import { LiveDeviceCard } from "./LiveDeviceCard";
import { summarizeClusters } from "../utils/clusterSummaries";


export function DeviceClusterGrid() {
  const { devices, history } = useLiveDevices();
  const clusters = clusterDevices(devices);
  const summary = summarizeClusters(devices, history);

  const renderClusterHeader = (title, key, className) => {
    const s = summary[key];
    return (
      <div className={`cluster-header ${className}`}>
        <div>
          <h3>{title}</h3>
          <span>{s.total} devices</span>
        </div>
        <div className="cluster-trends">
          <span>{s.up} ↑</span>
          <span>{s.down} ↓</span>
          <span>{s.stable} →</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cluster-grid">
      {renderCluster("High risk", clusters.high, "cluster-high")}
      {renderCluster("Medium risk", clusters.medium, "cluster-medium")}
      {renderCluster("Low risk", clusters.low, "cluster-low")}
      {renderCluster("Stable", clusters.stable, "cluster-stable")}
      {renderCluster("Unknown", clusters.unknown, "cluster-unknown")}
    </div>
  );
}