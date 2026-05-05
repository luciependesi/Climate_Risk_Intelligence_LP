// src/pages/ClusterOverviewLayout.jsx
import React, { useState } from "react";

export default function ClusterOverviewLayout({ children }) {
  const [tab, setTab] = useState("overview");
  const [range, setRange] = useState("24h");
  const [riskFilter, setRiskFilter] = useState("all");

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 4 }}>Cluster Intelligence</h2>
      <p style={{ marginTop: 0, opacity: 0.7 }}>
        System‑level risk, trends, alerts, and spatial patterns.
      </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="1h">Last 1h</option>
          <option value="6h">Last 6h</option>
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7 days</option>
        </select>

        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="all">All risk levels</option>
          <option value="low">Low (0–49)</option>
          <option value="med">Medium (50–79)</option>
          <option value="high">High (80+)</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {["overview", "heatmap", "timeline", "alerts", "map"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: tab === t ? "#eee" : "#fff",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{children(tab, range, riskFilter)}</div>
    </div>
  );
}