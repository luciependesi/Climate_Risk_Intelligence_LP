// src/components/AlertHeatmap.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";

export default function AlertHeatmap({ alerts }) {
  const { isVirtual } = useDeviceContext();

  if (!alerts || alerts.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title flex items-center gap-2">
          Alert Heatmap
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No alerts yet.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Alert Heatmap
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <div className="grid grid-cols-12 gap-1 mt-3">
        {alerts.map((a, i) => {
          const color =
            a.level === "critical"
              ? "#f44336"
              : a.level === "warning"
              ? "#ff9800"
              : "#4caf50";

          return (
            <div
              key={i}
              title={`${a.level.toUpperCase()} — ${new Date(
                a.timestamp
              ).toLocaleString()}`}
              style={{
                width: "100%",
                height: "20px",
                background: color,
                opacity: isVirtual ? 0.5 : 0.9,
                borderRadius: "4px",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}