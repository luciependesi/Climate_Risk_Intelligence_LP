import { useEffect, useState } from "react";

type ClusterRisk = {
  cluster_id: string;
  risk_score: number;
  device_count: number;
  timestamp_ms: number;
};

export function useClusters(clusterIds: string[]) {
  const [data, setData] = useState<ClusterRisk[]>([]);
  const [loading, setLoading] = useState<boolean>(clusterIds.length > 0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clusterIds.length) {
      setData([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(
      clusterIds.map((id) =>
        fetch(`/clusters/${encodeURIComponent(id)}/risk`).then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<ClusterRisk>;
        })
      )
    )
      .then((results) => {
        if (!cancelled) setData(results);
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clusterIds.join(",")]);

  return { data, loading, error };
}