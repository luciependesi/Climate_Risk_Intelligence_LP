export async function fetchLatestReadings() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/readings/latest`);
  return res.json();
}

export async function fetchDeviceHistory(deviceId: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/readings/device/${deviceId}`);
  return res.json();
}