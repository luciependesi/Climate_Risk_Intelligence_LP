// src/hooks/useMultiClusterRisk.ts
import { useQuery } from "@tanstack/react-query";

export function useMultiClusterRisk(clusterIds: string[]) {
  return useQuery({
    queryKey: ["multi-cluster-risk", clusterIds],
    queryFn: async () => {
      const results = await Promise.all(
        clusterIds.map(async (id) => {
          const res = await fetch(`/api/cluster-risk?cluster_id=${id}`);
          if (!res.ok) throw new Error("Failed cluster " + id);
          const data = await res.json();
          return { id, data };
        })
      );
      return results;
    },
  });
}