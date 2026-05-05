//Custom hook to fetch live device data every 5 seconds.
import { useEffect, useState } from "react";

export function useLiveDevices() {
  const [devices, setDevices] = useState({});

  async function fetchDevices() {
    try {
      const res = await fetch("http://localhost:8000/api/devices");
      if (!res.ok) return;

      const data = await res.json();

      // Convert array → object keyed by device_id
      const mapped = {};
      data.forEach((d) => {
        mapped[d.device_id] = d;
      });

      setDevices(mapped);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  }

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return { devices };
}