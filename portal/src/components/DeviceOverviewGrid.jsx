// shows a grid of devices with their health and battery status.
import React from "react";

export default function DeviceOverviewGrid({ devices }) {
  const list = Object.values(devices || {});

  if (list.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Devices</h3>
        <p className="text-gray-400 italic">No devices online.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {list.map((d) => (
        <div
          key={d.device_id}
          className="p-4 border rounded-lg bg-white shadow-sm"
        >
          <h4 className="font-semibold">{d.device_id}</h4>
          <p className="text-sm text-gray-600">Health: {d.health}</p>
          <p className="text-sm text-gray-600">
            Battery: {d.battery_v?.toFixed(2) ?? "—"} V
          </p>
          <p className="text-sm text-gray-600">
            RSSI: {d.rssi ?? "—"} dBm
          </p>
        </div>
      ))}
    </div>
  );
}