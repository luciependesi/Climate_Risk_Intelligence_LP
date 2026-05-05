//Tabbed Layout (Overview / Devices / Map / Analytics)
<Breadcrumbs />
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import DevicesPage from "./DevicesPage";
import MapPage from "./MapPage";
import AnalyticsPage from "./AnalyticsPage";
import "../styles/Tabs.css";

export default function AppTabs() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="tabs-container">
      <div className="tab-bar">
        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>

<button onClick={() => document.body.classList.toggle("dark")}>
  Dark Mode
</button>
        <button
          className={tab === "devices" ? "active" : ""}
          onClick={() => setTab("devices")}
        >
          Devices
        </button>

        <button
          className={tab === "map" ? "active" : ""}
          onClick={() => setTab("map")}
        >
          Map
        </button>

        <button
          className={tab === "analytics" ? "active" : ""}
          onClick={() => setTab("analytics")}
        >
          Analytics
        </button>
      </div>

<button
  style={{ marginLeft: "auto" }}
  onClick={() => document.body.classList.toggle("dark")}
>
  Dark Mode
</button>

      <div className="tab-content">
        {tab === "overview" && <Dashboard />}
        {tab === "devices" && <DevicesPage />}
        {tab === "map" && <MapPage />}
        {tab === "analytics" && <AnalyticsPage />}
      </div>
    </div>
  );
}