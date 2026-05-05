const API_URL = import.meta.env.VITE_API_URL;

export async function fetchDevices() {
  const res = await fetch(`${API_URL}/api/devices`);
  if (!res.ok) throw new Error("Failed to fetch devices");
  return res.json();
}