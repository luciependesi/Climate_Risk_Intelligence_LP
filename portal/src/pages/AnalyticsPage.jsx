//Tableau‑Connected Analytics Page
<Breadcrumbs />
import React from "react";
import "../styles/Analytics.css";

export default function AnalyticsPage() {
  return (
    <div className="card analytics-card">
      <h2>Climate Analytics</h2>
      <p>Historical risk, NOAA/EPA context, and ML predictions.</p>

      <iframe
        title="Tableau Climate Analytics"
        src="https://public.tableau.com/views/YOUR_DASHBOARD_ID"
        width="100%"
        height="800"
        style={{ border: "none", borderRadius: "12px" }}
      />
    </div>
  );
}