import { useQuery } from "@tanstack/react-query";
import { ClusterForecastResponse } from "../types/cluster";

export function useClusterForecast() {
  return useQuery<ClusterForecastResponse>({
    queryKey: ["cluster-forecast"],
    queryFn: async () => {
      const res = await fetch("/api/cluster-forecast");
      if (!res.ok) throw new Error("Failed to fetch forecast");
      return res.json();
    },
    refetchInterval: 30_000,
  });
}