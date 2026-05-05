// Allows the user to select a device from the list of available devices.
// src/components/DeviceSelector.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";

export default function DeviceSelector() {
  const { devices, selectedDevice, setSelectedDevice, mode } = useDeviceContext();

  if (!devices || devices.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title">Devices</h3>
        <p className="text-gray-400 italic">No devices found.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Devices
        <VirtualBadge isVirtual={mode === "mock"} />
      </h3>

      <div className="flex flex-col mt-3 space-y-2">
        {devices.map((d) => (
          <button
            key={d.id || d.device_id}
            onClick={() => setSelectedDevice(d)}
            className={`p-2 rounded-md text-left transition-all ${
              selectedDevice?.id === d.id ||
              selectedDevice?.device_id === d.device_id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {d.name || `Device ${d.id || d.device_id}`}
          </button>
        ))}
      </div>
    </div>
  );
}