//Live Alerts Feed
// src/pages/AlertsPage.jsx
<Breadcrumbs />
import React from "react";
import { useLiveAlerts } from "../hooks/useLiveAlerts";
import "../styles/LiveDeviceCard.css";

export default function AlertsPage() {
  const { alerts } = useLiveAlerts();

  return (
    <div className="card" style={{ padding: "20px" }}>
      <h2>Alerts</h2>

      {alerts.length === 0 && <p>No alerts yet.</p>}

      <ul className="alert-list">
        {alerts.map((a, i) => (
          <li key={i} className="alert-item">
            <strong>{a.device_id}</strong> — {a.message}
            <span className="timestamp">
              {new Date(a.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}