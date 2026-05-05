// This component displays a timeline of anonalies for a given device. 
import React, { useEffect, useState } from "react";

export default function AnomalyTimeline({ deviceId, mode = "live" }) {
  const [events, setEvents] = useState([]);

  const base = mode === "live" ? "/api" : "/mock";

  useEffect(() => {
    if (!deviceId) return;

    async function fetchAnomalies() {
      try {
        const res = await fetch(`${base}/anomalies/anomalies_${deviceId}.json`);
        if (!res.ok) return;
        const data = await res.json();
        setEvents(data);
      } catch (e) {
        console.error("Failed to load anomalies", e);
      }
    }

    fetchAnomalies();
  }, [deviceId, mode]);

  if (!events.length) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Anomaly Timeline</h3>
        <p className="text-gray-400 italic">No anomalies detected.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Anomaly Timeline</h3>

      <div className="space-y-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="p-3 border rounded-lg bg-gray-50 shadow-sm"
          >
            <p className="text-sm text-gray-700">
              <strong>{e.type.replace(/_/g, " ")}</strong> — {e.severity}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(e.timestamp).toLocaleString()}
            </p>

            {e.details && (
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(e.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}