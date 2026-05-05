import { useEffect, useState } from "react";
import { apiGet } from "./apiClient";

export function useDevices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiGet(`/devices`)
      .then((d) => mounted && setDevices(d))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { devices, loading };
}