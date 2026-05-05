// src/api/useRisk.js
import { useEffect, useState } from "react";
import { api } from "./client";

export function useRisk(deviceId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    api
      .getRisk(deviceId)
      .then((res) => !cancelled && setData(res))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  return { data, loading };
}