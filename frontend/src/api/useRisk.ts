import { useEffect, useState } from "react";
import { apiGet } from "./apiClient";

export function useRisk(deviceId: string) {
  const [risk, setRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiGet(`/risk/${deviceId}`)
      .then((d) => mounted && setRisk(d))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [deviceId]);

  return { risk, loading };
}