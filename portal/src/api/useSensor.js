import { apiGet } from "./client";

// -------------------- LATEST --------------------
export function useLatestSensor() {
  return {
    fetchLatest: (deviceId) =>
      apiGet(`/api/sensor/latest?device_id=${String(deviceId)}`),
  };
}

// -------------------- HISTORY --------------------
export function useSensorHistory() {
  return {
    fetchHistory: (deviceId, limit = 100) =>
      apiGet(
        `/api/sensor/history?device_id=${String(deviceId)}&limit=${limit}`
      ),
  };
}

// -------------------- RISK SCORE --------------------
export function useRiskScore() {
  return {
    fetchRisk: (deviceId) =>
      apiGet(`/api/sensor/risk_score?device_id=${String(deviceId)}`),
  };
}

// -------------------- CONFIDENCE --------------------
export function useConfidence() {
  return {
    fetchConfidence: (deviceId) =>
      apiGet(`/api/sensor/confidence?device_id=${String(deviceId)}`),
  };
}