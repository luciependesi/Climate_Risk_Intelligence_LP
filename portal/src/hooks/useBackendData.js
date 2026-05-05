import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// -------------------- LATEST --------------------
export function useBackendLatest(deviceId) {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    if (!deviceId) return;

    const id = String(deviceId);   // 🔥 normalize to string

    fetch(`${API_URL}/api/sensor/latest?device_id=${id}`)
      .then((res) => res.json())
      .then(setLatest)
      .catch(console.error);
  }, [deviceId]);

  return latest;
}

// -------------------- RISK SCORE --------------------
export function useBackendRisk(deviceId) {
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    if (!deviceId) return;

    const id = String(deviceId);   // 🔥 normalize to string

    fetch(`${API_URL}/api/sensor/risk_score?device_id=${id}`)
      .then((res) => res.json())
      .then(setRisk)
      .catch(console.error);
  }, [deviceId]);

  return risk;
}

// -------------------- HISTORY --------------------
export function useBackendHistory(deviceId) {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    if (!deviceId) return;

    const id = String(deviceId);   // 🔥 normalize to string

    fetch(`${API_URL}/api/sensor/history?device_id=${id}`)
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, [deviceId]);

  return history;
}

// -------------------- CONFIDENCE / ALERTS --------------------
export function useBackendAlerts(deviceId) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!deviceId) return;

    const id = String(deviceId);   // 🔥 normalize to string

    fetch(`${API_URL}/api/sensor/confidence?device_id=${id}`)
      .then((res) => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, [deviceId]);

  return alerts;
}