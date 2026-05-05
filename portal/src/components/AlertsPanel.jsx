//  shows alerts for the selected device, polling every 5 seconds 
// src/components/AlertsPanel.jsx
import React, { useEffect, useState } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import { useWS } from "../context/WebSocketContext";

export default function AlertsPanel({ deviceId: propDeviceId }) {
  const { selectedDeviceId } = useDeviceContext();
  const deviceId = propDeviceId || selectedDeviceId;

  const { subscribe } = useWS();
  const [alerts, setAlerts] = useState([]);

  if (!deviceId) {
    return (
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Alerts</h3>
        <p className="text-gray-400 italic">Waiting for device…</p>
      </div>
    );
  }

  useEffect(() => {
    if (!deviceId || !subscribe) return;

    return subscribe((msg) => {
      if (msg.type === "alert" && msg.device_id === deviceId) {
        setAlerts((prev) => [msg, ...prev].slice(0, 50));
      }
    });
  }, [deviceId, subscribe]);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Alerts</h3>
        <p className="text-gray-400 italic">No alerts.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade-in">
      <h3 className="text-lg font-semibold mb-2">Alerts</h3>

      <ul className="space-y-2">
        {alerts.map((a, idx) => (
          <li
            key={a.alert_id || idx}
            className="text-sm transition-all duration-300 hover:scale-[1.01]"
          >
            <strong
              className={
                a.severity === "critical"
                  ? "text-red-600"
                  : a.severity === "warning"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }
            >
              {a.severity?.toUpperCase() || "INFO"}
            </strong>{" "}
            — {a.alert_message}
            <br />
            <span className="text-gray-500 text-xs">
              {new Date(a.timestamp_ms ?? a.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}