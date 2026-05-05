//device list + mode toggle 
// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

import { useDeviceContext } from "../context/DeviceContext";

export default function Sidebar() {
  const {
    devices,
    deviceIds,
    selectedDeviceId,
    setSelectedDeviceId,
    mode,
    setMode,
  } = useDeviceContext();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Devices</h2>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {deviceIds.map((id) => {
          const d = devices[id];
          const isActive = id === selectedDeviceId;

          return (
            <button
              key={id}
              onClick={() => setSelectedDeviceId(id)}
              className={`w-full text-left px-3 py-2 rounded 
                ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}
              `}
            >
              <div className="font-semibold">{id}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {d.health ?? "unknown"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setMode(mode === "live" ? "mock" : "live")}
          className="w-full px-3 py-2 border rounded"
        >
          Mode: {mode}
        </button>
      </div>
    </div>
  );
}