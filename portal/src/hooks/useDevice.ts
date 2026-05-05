import { useFetchJson } from "./useFetchJson";

export function useDevice(deviceId: string | null) {
  const url =
    deviceId != null
      ? `/devices/${encodeURIComponent(deviceId)}/health`
      : null;

  return useFetchJson<any>(url);
}