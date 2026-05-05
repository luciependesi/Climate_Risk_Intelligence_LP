// this component shows firmware status and allows triggering updates.
import React, { useEffect, useState } from "react";

export default function FirmwarePanel({ deviceId, mode = "live" }) {
  const [available, setAvailable] = useState(null);
  const [status, setStatus] = useState(null);
  const [updating, setUpdating] = useState(false);

  const base = mode === "live" ? "/api" : "/mock";

  useEffect(() => {
    async function loadAvailable() {
      const res = await fetch(`${base}/firmware/available.json`);
      if (!res.ok) return;
      setAvailable(await res.json());
    }
    loadAvailable();
  }, [mode]);

  useEffect(() => {
    if (!deviceId) return;

    async function loadStatus() {
      const res = await fetch(
        `${base}/firmware/update_status_${deviceId}.json`
      );
      if (!res.ok) return;
      setStatus(await res.json());
    }
    loadStatus();
  }, [deviceId, mode]);

  async function triggerUpdate() {
    setUpdating(true);

    // In mock mode, simulate update
    await new Promise((r) => setTimeout(r, 1500));

    setStatus((prev) => ({
      ...prev,
      status: "in_progress",
      target_version: available.latest_version,
    }));

    setUpdating(false);
  }

  if (!available || !status) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Firmware</h3>
        <p className="text-gray-400 italic">Loading firmware info...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm max-w-lg">
      <h3 className="text-lg font-semibold mb-4">Firmware</h3>

      <p className="text-sm text-gray-700">
        Current version:{" "}
        <span className="font-semibold">{status.current_version}</span>
      </p>

      <p className="text-sm text-gray-700">
        Latest available:{" "}
        <span className="font-semibold">{available.latest_version}</span>
      </p>

      <p className="text-sm text-gray-700">
        Status:{" "}
        <span className="font-semibold capitalize">{status.status}</span>
      </p>

      <p className="text-xs text-gray-500 mt-1">
        Last update: {new Date(status.last_update).toLocaleString()}
      </p>

      <button
        onClick={triggerUpdate}
        disabled={updating || status.status === "in_progress"}
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
      >
        {updating
          ? "Starting update..."
          : status.status === "in_progress"
          ? "Updating..."
          : "Update Firmware"}
      </button>

      <div className="mt-4 p-3 bg-gray-50 border rounded">
        <h4 className="font-semibold text-sm mb-1">Release Notes</h4>
        <p className="text-xs text-gray-700">{available.release_notes}</p>
      </div>
    </div>
  );
}