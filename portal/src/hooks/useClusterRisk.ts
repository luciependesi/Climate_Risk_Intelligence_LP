// src/hooks/useClusterRisk.ts
import { useQuery } from "@tanstack/react-query";
import { ClusterRiskResponse } from "../types/cluster";

export function useClusterRisk() {
  return useQuery<ClusterRiskResponse>({
    queryKey: ["cluster-risk"],
    queryFn: async () => {
      const res = await fetch("/api/cluster-risk");
      if (!res.ok) throw new Error("Failed to fetch cluster risk");
      return res.json();
    },
    refetchInterval: 10_000,
  });
}