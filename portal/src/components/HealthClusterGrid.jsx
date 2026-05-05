// src/components/HealthClusterGrid.jsx
import React from "react";
import VirtualBadge from "./VirtualBadge";
import { useDeviceContext } from "../context/DeviceContext";

export default function HealthClusterGrid({ clusters }) {
  const { isVirtual } = useDeviceContext();

  if (!clusters || clusters.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title flex items-center gap-2">
          Health Cluster Grid
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No cluster data.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Health Cluster Grid
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <div className="grid grid-cols-4 gap-3 mt-3">
        {clusters.map((c, i) => {
          const color =
            c.health === "healthy"
              ? "bg-green-500"
              : c.health === "warning"
              ? "bg-yellow-500"
              : c.health === "offline"
              ? "bg-red-500"
              : "bg-gray-400";

          return (
            <div
              key={i}
              className={`p-3 rounded-lg text-white ${color}`}
              style={{
                opacity: isVirtual ? 0.6 : 1,
              }}
            >
              <h4 className="font-semibold">Cluster {c.cluster_id}</h4>
              <p>Devices: {c.device_count}</p>
              <p>Health: {c.health}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}