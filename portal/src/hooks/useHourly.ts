import { useFetchJson } from "./useFetchJson";

export function useHourly(deviceId: string | null, start?: string, end?: string) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);

  const url =
    deviceId != null
      ? `/analytics/devices/${encodeURIComponent(deviceId)}/hourly?${params.toString()}`
      : null;

  return useFetchJson<Array<any>>(url);
}