// src/components/AlertTimeline.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";

export default function AlertTimeline({ alerts }) {
  const { isVirtual } = useDeviceContext();

  if (!alerts || alerts.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title flex items-center gap-2">
          Alert Timeline
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No alerts yet.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Alert Timeline
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <div className="flex flex-col mt-3">
        {alerts.map((a, i) => {
          const color =
            a.level === "critical"
              ? "#f44336"
              : a.level === "warning"
              ? "#ff9800"
              : "#4caf50";

          return (
            <div key={i} className="flex items-start gap-3 mb-4">
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: color,
                  opacity: isVirtual ? 0.6 : 1,
                }}
              />

              <div>
                <div className="font-semibold">{a.level.toUpperCase()}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(a.timestamp).toLocaleString()}
                </div>
                <div className="mt-1">{a.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}