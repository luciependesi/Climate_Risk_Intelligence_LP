// src/components/ClusterRiskAlerts.jsx
// src/components/ClusterRiskAlerts.jsx
import React from "react";
import VirtualBadge from "./VirtualBadge";
import { useDeviceContext } from "../context/DeviceContext";

export default function ClusterRiskAlerts({ alerts }) {
  const { isVirtual } = useDeviceContext();

  if (!alerts || alerts.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title flex items-center gap-2">
          Cluster Alerts
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No alerts.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Cluster Alerts
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <ul className="mt-3 space-y-3">
        {alerts.map((a, i) => (
          <li key={i} className="border-b pb-2">
            <div className="font-semibold text-red-600">
              {a.level.toUpperCase()}
            </div>
            <div className="text-gray-400 text-sm">
              {new Date(a.timestamp).toLocaleString()}
            </div>
            <div>{a.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}