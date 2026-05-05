// src/components/AlertList.jsx
// This componement displays a list of alerts for a given device and subscribes to live updates using the useLiveDeviceStream hook.
// src/components/AlertList.jsx
import React from "react";
import { useLiveDeviceStream } from "../hooks/useLiveDeviceStream";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";

function severityColor(sev) {
  if (sev === "critical") return "var(--critical)";
  if (sev === "warning") return "var(--warning)";
  return "var(--muted)";
}

export function AlertList({ deviceId }) {
  const { latest, history } = useLiveDeviceStream(deviceId);
  const { isVirtual } = useDeviceContext();

  // Loading state
  if (!latest) {
    return (
      <div className="card fade">
        <div className="card-title flex items-center gap-2">
          Alerts
          <VirtualBadge isVirtual={isVirtual} />
        </div>
        <div className="skeleton" style={{ height: "2rem", width: "70%" }} />
      </div>
    );
  }

  // Extract alerts from history
  const alerts = history
    .filter((e) => e.type === "alert")
    .map((e) => e.alert)
    .reverse();

  if (alerts.length === 0) {
    return (
      <div className="card fade">
        <div className="card-title flex items-center gap-2">
          Alerts
          <VirtualBadge isVirtual={isVirtual} />
        </div>
        <p className="text-gray-400 italic">No alerts yet.</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <div className="flex items-center justify-between mb-2">
        <h3 className="card-title flex items-center gap-2">
          Alerts
          <VirtualBadge isVirtual={isVirtual} />
        </h3>

        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      {alerts.map((alert, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <div
            className={`status-${alert.level.toLowerCase()}`}
            style={{ color: severityColor(alert.level) }}
          >
            {alert.level.toUpperCase()}
          </div>

          <div style={{ opacity: 0.8, marginBottom: "0.25rem" }}>
            {new Date(alert.timestamp).toLocaleString()}
          </div>

          <div style={{ marginBottom: "0.25rem" }}>{alert.message}</div>

          <div style={{ opacity: 0.7 }}>
            Risk score: {alert.risk_score}
          </div>

          {i < alerts.length - 1 && (
            <hr style={{ margin: "1rem 0", borderColor: "#333" }} />
          )}
        </div>
      ))}
    </div>
  );
}
export default AlertList;