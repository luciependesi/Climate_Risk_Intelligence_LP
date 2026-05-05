// src/components/NavBar.js
// shows the app title and the number of devices online, and allows switching between lines and mock data modes.
// src/components/NavBar.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import ModeToggle from "../components/ModeToggle";

export default function NavBar() {
  const { selectedDeviceId, mode, setMode } = useDeviceContext();

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Climate Intelligence Portal</h1>

      <div className="flex items-center space-x-4">
        {/* Mode toggle button */}
        <ModeToggle mode={mode} setMode={setMode} />

        {/* Mode text */}
        <span className="text-gray-600 dark:text-gray-300">
          Mode: {mode}
        </span>

        {/* Active device */}
        {selectedDeviceId && (
          <span className="text-gray-600 dark:text-gray-300">
            Active Device: <strong>{selectedDeviceId}</strong>
          </span>
        )}
      </div>
    </div>
  );
}