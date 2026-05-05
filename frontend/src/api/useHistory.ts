import { useEffect, useState } from "react";
import { apiGet } from "./apiClient";

export function useHistory(deviceId: string, startMs: number, endMs: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiGet(`/readings/history/${deviceId}?start_ms=${startMs}&end_ms=${endMs}`)
      .then((d) => mounted && setData(d))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [deviceId, startMs, endMs]);

  return { data, loading };
}