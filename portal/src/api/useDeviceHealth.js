// src/api/useDeviceHealth.js
import { useEffect, useState } from "react";
import { useEffect, useState } from "react";

export function useDeviceHealth(deviceId) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    window.mockApi
      .getDeviceHealth(deviceId)
      .then((res) => {
        if (!cancelled) setHealth(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  return { health, loading };
}