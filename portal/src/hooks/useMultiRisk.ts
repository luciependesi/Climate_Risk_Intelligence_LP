import { useRisk } from "./useAggregates";

export function useMultiRisk(deviceIds: string[]) {
  return deviceIds.map((id) => useRisk(id));
}