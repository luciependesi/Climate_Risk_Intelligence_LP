// frontend/src/api/sensor.ts
// Frontend API service

export type SensorReading = {
  id: number;
  device_id: string;
  received_at: string;
  temperature_c: number | null;
  humidity_percent: number | null;
  pressure_hpa: number | null;
  air_quality_raw: number | null;
  rain_level_raw: number | null;
  water_level_raw: number | null;
  battery_mv: number | null;
  gnss_enabled: boolean | null;
  gnss_fix_valid: boolean | null;
  latitude_deg: number | null;
  longitude_deg: number | null;
  altitude_m: number | null;
  hdop: number | null;
  timestamp_ms: number | null;
  risk_score?: number | null;
};

export type Mode = "mock" | "live";

export async function fetchSensorLatest(
  mode: Mode,
  deviceId: string
): Promise<SensorReading> {
  if (mode === "mock") {
    const res = await fetch(`/api/mock/sensor/latest?device_id=${encodeURIComponent(deviceId)}`);
    if (!res.ok) throw new Error("Failed to fetch mock sensor data");
    return res.json();
  }

  const res = await fetch(`/api/sensor/latest?device_id=${encodeURIComponent(deviceId)}`);
  if (!res.ok) throw new Error("Failed to fetch sensor data");
  return res.json();
}

export async function fetchSensorHistory(
  mode: Mode,
  deviceId: string,
  limit = 100
): Promise<SensorReading[]> {
  if (mode === "mock") {
    const res = await fetch(
      `/api/mock/sensor/history?device_id=${encodeURIComponent(deviceId)}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Failed to fetch mock history");
    return res.json();
  }

  const res = await fetch(
    `/api/sensor/history?device_id=${encodeURIComponent(deviceId)}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function fetchRiskScore(
  mode: Mode,
  deviceId: string
): Promise<{ device_id: string; risk_score: number }> {
  if (mode === "mock") {
    const res = await fetch(`/api/mock/sensor/risk_score?device_id=${encodeURIComponent(deviceId)}`);
    if (!res.ok) throw new Error("Failed to fetch mock risk score");
    return res.json();
  }

  const res = await fetch(`/api/sensor/risk_score?device_id=${encodeURIComponent(deviceId)}`);
  if (!res.ok) throw new Error("Failed to fetch risk score");
  return res.json();
}

export async function fetchClusterRisk(deviceIds: string[]) {
  const res = await fetch(`/api/cluster/risk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_ids: deviceIds }),
  });
  if (!res.ok) throw new Error("Failed to fetch cluster risk");
  return res.json();
}

export async function fetchHealth(deviceId: string) {
  const res = await fetch(`/api/sensor/health?device_id=${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch health score");
  return res.json();
}

export async function fetchConfidence(deviceId: string) {
  const res = await fetch(`/api/sensor/confidence?device_id=${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch confidence");
  return res.json() as Promise<{ device_id: string; confidence: number }>;
}

export async function fetchDrift(deviceId: string) {
  const res = await fetch(`/api/model/drift?device_id=${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch drift");
  return res.json() as Promise<{ drift_score: number; flag: boolean }>;
}