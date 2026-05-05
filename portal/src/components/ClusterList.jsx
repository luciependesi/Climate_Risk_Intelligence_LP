// src/components/ClusterList.jsx
import React from "react";

export default function ClusterList({ devices }) {
  const list = Object.values(devices || {});

  const groups = {
    healthy: [],
    warning: [],
    offline: [],
    unknown: [],
  };

  list.forEach((d) => {
    const health = d.health ?? "unknown";
    groups[health].push(d);
  });

  const renderGroup = (label, items, color) => (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <span className={`h-3 w-3 rounded-full mr-2 ${color}`} />
        {label} — {items.length} device{items.length !== 1 ? "s" : ""}
      </h3>

      {items.length === 0 ? (
        <p className="text-gray-400 italic">No devices in this category.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((d) => (
            <li key={d.device_id} className="text-sm">
              <strong>{d.device_id}</strong>
              {d.latest_reading?.risk_score_unified !== undefined && (
                <>
                  {" "}
                  — Risk:{" "}
                  {d.latest_reading.risk_score_unified.toFixed(1)}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderGroup("Healthy", groups.healthy, "bg-green-500")}
      {renderGroup("Warning", groups.warning, "bg-yellow-500")}
      {renderGroup("Offline", groups.offline, "bg-red-500")}
      {renderGroup("Unknown", groups.unknown, "bg-gray-400")}
    </div>
  );
}