import { useEffect, useState } from "react";
import { apiGet } from "./apiClient";

export function useLatestReading(deviceId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiGet(`/readings/latest/${deviceId}`)
      .then((d) => mounted && setData(d))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [deviceId]);

  return { data, loading };
}