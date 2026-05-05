// src/components/ClusterComparisonPage.jsx
import React from "react";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import { useDeviceContext } from "../context/DeviceContext";

export default function ClusterComparisonPage({ clusters }) {
  const { isVirtual } = useDeviceContext();

  if (!clusters || clusters.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title flex items-center gap-2">
          Cluster Comparison
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No cluster data available.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <div className="flex items-center justify-between mb-2">
        <h3 className="card-title flex items-center gap-2">
          Cluster Comparison
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-3">
        {clusters.map((c, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-800"
          >
            <h4 className="font-semibold mb-1">Cluster {c.cluster_id}</h4>
            <p>Avg Risk: {c.avg_risk?.toFixed(1)}</p>
            <p>Devices: {c.device_count}</p>
            <p>Trend: {c.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}