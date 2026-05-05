// src/components/DeviceHealthCard.jsx
import React from "react";
import DeviceHealthTimeline from "./DeviceHealthTimeline";
import "../styles/LiveDeviceCard.css";
import "../styles/ClusterGrid.css";

export default function DeviceHealthCard({ loading, health }) {
  if (loading || !health) {
    return (
      <div className="card fade small-card">
        <div className="skeleton" style={{ height: "1.5rem", width: "60%" }} />
        <div
          className="skeleton"
          style={{ height: "1rem", width: "80%", marginTop: "0.5rem" }}
        />
      </div>
    );
  }

  return (
    <div className="card fade small-card">
      <div className={`status-${health.status?.toLowerCase() || "unknown"}`}>
        {health.status?.toUpperCase() || "UNKNOWN"}
      </div>

      <div style={{ opacity: 0.8, marginTop: "0.25rem" }}>
        {new Date(health.timestamp).toLocaleString()}
      </div>

      <div
        style={{
          fontSize: "0.85rem",
          opacity: 0.7,
          marginTop: "0.5rem",
        }}
      >
        Interval: {health.avg_interval_sec ?? "--"}s
        &nbsp;•&nbsp;
        Uptime: {health.uptime_percent?.toFixed?.(1) ?? "--"}%
      </div>
    </div>
  );
}