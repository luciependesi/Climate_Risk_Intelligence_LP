// src/hooks/useClusterAnomalies.ts
import { useQuery } from "@tanstack/react-query";
import { ClusterAnomalyResponse } from "../types/cluster";

export function useClusterAnomalies() {
  return useQuery<ClusterAnomalyResponse>({
    queryKey: ["cluster-anomalies"],
    queryFn: async () => {
      const res = await fetch("/api/cluster-anomalies");
      if (!res.ok) throw new Error("Failed to fetch anomalies");
      return res.json();
    },
  });
}