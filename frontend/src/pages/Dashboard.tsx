//Full Integrated Dashboard, fully animated, real‑time climate‑risk console
// frontend/src/pages/Dashboard.tsx

import { useState, useEffect } from "react";
import { useMode } from "../state/useMode";
import { useSensorData } from "../hooks/useSensorData";

import {
  fetchSensorHistory,
  fetchClusterRisk,
  fetchHealth,
} from "../api/sensor";

import { RiskGauge } from "../components/RiskGauge";
import { RiskTrendCard } from "../components/RiskTrendCard";
import { ClusterRiskCard } from "../components/ClusterRiskCard";
import { DeviceHealthCard } from "../components/DeviceHealthCard";
import { AlertsPanel } from "../components/AlertsPanel";
import { ClusterGrid } from "../components/ClusterGrid";
import { DeviceMap } from "../components/DeviceMap";
import { SubscriberSettings } from "../components/SubscriberSettings";
import { HistoricalCharts } from "../components/HistoricalCharts";
import { RiskDecomposition } from "../components/RiskDecomposition";

import "../styles/dashboard.css";

export default function Dashboard() {
  // Global mode toggle
  const { mode, setMode } = useMode();

  // Device + cluster selection
  const [deviceId, setDeviceId] = useState("esp32_001");
  const [clusterDevices, setClusterDevices] = useState(["esp32_001"]);

  // Live sensor data
  const {
    data,
    loading,
    error,
    riskScore,
    prevRiskScore,
  } = useSensorData(mode, deviceId, 6000);

  // History for charts + trend
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Cluster risk
  const [clusterRisk, setClusterRisk] = useState(null);
  const [clusterRiskPrev, setClusterRiskPrev] = useState(null);

  // Device health
  const [healthScore, setHealthScore] = useState(null);

  // Alerts
  const [alerts, setAlerts] = useState([]);

  // Subscriber settings
  const [subscriberSettings, setSubscriberSettings] = useState({
    highRisk: 0.7,
    aqi: 350,
    rain: 50,
    battery: 3600,
  });

  // Fetch history
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setHistoryLoading(true);
        const hist = await fetchSensorHistory(mode, deviceId, 50);
        if (!cancelled) {
          setHistory(hist.map((h) => h.risk_score ?? 0));
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    loadHistory();
    const timer = setInterval(loadHistory, 10000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [mode, deviceId]);

  // Fetch cluster risk
  useEffect(() => {
    async function loadCluster() {
      const prev = clusterRisk;
      const res = await fetchClusterRisk(clusterDevices);
      setClusterRiskPrev(prev);
      setClusterRisk(res.cluster_risk);
    }
    loadCluster();
  }, [riskScore, clusterDevices]);

  // Fetch device health
  useEffect(() => {
    async function loadHealth() {
      const res = await fetchHealth(deviceId);
      setHealthScore(res.health_score);
    }
    loadHealth();
  }, [riskScore, deviceId]);

  // Alerts based on subscriber settings
  useEffect(() => {
    if (!data || riskScore == null) return;

    const a = [];

    if (riskScore >= subscriberSettings.highRisk) {
      a.push("High unified risk detected");
    }
    if (data.air_quality_raw > subscriberSettings.aqi) {
      a.push("Air quality deteriorating");
    }
    if (data.rain_level_raw > subscriberSettings.rain) {
      a.push("Heavy rainfall detected");
    }
    if (data.battery_mv < subscriberSettings.battery) {
      a.push("Device battery low");
    }

    setAlerts(a);
  }, [data, riskScore, subscriberSettings]);

  // Map device list
  const mapDevices = clusterDevices.map((id) => ({
    id,
    lat: data?.latitude_deg ?? 40.44,
    lon: data?.longitude_deg ?? -79.99,
    risk: riskScore,
  }));

  return (
    <div className="dashboard-grid">

      {/* HEADER */}
      <div className="dashboard-header card">
        <div className="header-left">
          <h2>Climate Risk Dashboard</h2>
        </div>

        <div className="header-right">
          {/* Device selector */}
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          >
            <option value="esp32_001">ESP32 #1</option>
            <option value="esp32_002">ESP32 #2</option>
            <option value="esp32_003">ESP32 #3</option>
          </select>

          {/* Cluster selector */}
          <select
            multiple
            value={clusterDevices}
            onChange={(e) =>
              setClusterDevices(
                Array.from(e.target.selectedOptions).map((o) => o.value)
              )
            }
          >
            <option value="esp32_001">ESP32 #1</option>
            <option value="esp32_002">ESP32 #2</option>
            <option value="esp32_003">ESP32 #3</option>
          </select>

          {/* Mock/live toggle */}
          <button
            className="mode-toggle"
            onClick={() => setMode(mode === "mock" ? "live" : "mock")}
          >
            {mode === "mock" ? "Mock Mode" : "Live Mode"}
          </button>
        </div>
      </div>

      {/* LEFT COLUMN */}
      <div className="left-column">

        <RiskGauge
          score={riskScore}
          previous={prevRiskScore}
          loading={loading}
        />

        <RiskTrendCard
          history={history}
          loading={historyLoading}
        />

        <HistoricalCharts
          history={history}
          loading={historyLoading}
          data={data}
        />

        <RiskDecomposition
          reading={data}
          riskScore={riskScore}
          loading={loading}
        />

        <AlertsPanel alerts={alerts} loading={loading} />

        <SubscriberSettings
          initialHighRisk={subscriberSettings.highRisk}
          initialAqi={subscriberSettings.aqi}
          initialRain={subscriberSettings.rain}
          initialBattery={subscriberSettings.battery}
          onChange={setSubscriberSettings}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">

        <ClusterRiskCard
          score={clusterRisk}
          previous={clusterRiskPrev}
          loading={loading}
        />

        <DeviceHealthCard score={healthScore} loading={loading} />

        <DeviceMap devices={mapDevices} />

        <ClusterGrid
          devices={clusterDevices.map((id) => ({
            id,
            risk: riskScore,
            health: healthScore,
          }))}
          clusterRisk={clusterRisk}
          clusterRiskPrev={clusterRiskPrev}
          loading={loading}
        />
      </div>
    </div>
  );
}