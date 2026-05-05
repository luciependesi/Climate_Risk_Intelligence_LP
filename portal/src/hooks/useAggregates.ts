// auto-switches between mock and live data based on Mode config.
import { useQuery } from "@tanstack/react-query";
import { MODE } from "../config/mode";
import { mockHourly, mockDaily, mockRisk } from "../mock/aggregates";

const API_URL = import.meta.env.VITE_API_URL;

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function useHourly(deviceId: string) {
  return useQuery({
    queryKey: ["hourly", deviceId, MODE],
    queryFn: () =>
      MODE === "mock"
        ? Promise.resolve(mockHourly)
        : fetcher(`${API_URL}/api/readings/hourly/${deviceId}`),
    enabled: !!deviceId,
    refetchInterval: MODE === "live" ? 60000 : false,
  });
}

export function useDaily(deviceId: string) {
  return useQuery({
    queryKey: ["daily", deviceId, MODE],
    queryFn: () =>
      MODE === "mock"
        ? Promise.resolve(mockDaily)
        : fetcher(`${API_URL}/api/readings/daily/${deviceId}`),
    enabled: !!deviceId,
    refetchInterval: MODE === "live" ? 300000 : false,
  });
}

export function useRisk(deviceId: string) {
  return useQuery({
    queryKey: ["risk", deviceId, MODE],
    queryFn: () =>
      MODE === "mock"
        ? Promise.resolve(mockRisk)
        : fetcher(`${API_URL}/api/readings/risk/${deviceId}`),
    enabled: !!deviceId,
    refetchInterval: MODE === "live" ? 60000 : false,
  });
}
export function useAggregates() {
  return {
    useHourly,
    useDaily,
    useRisk,
  };
}