//this file contains functions to fetch aggregated data (hourly, daily, risk) for a give device.
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchHourly(deviceId: string) {
  const res = await fetch(`${API_URL}/api/readings/hourly/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch hourly data");
  return res.json();
}

export async function fetchDaily(deviceId: string) {
  const res = await fetch(`${API_URL}/api/readings/daily/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch daily data");
  return res.json();
}

export async function fetchRisk(deviceId: string) {
  const res = await fetch(`${API_URL}/api/readings/risk/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch risk data");
  return res.json();
}