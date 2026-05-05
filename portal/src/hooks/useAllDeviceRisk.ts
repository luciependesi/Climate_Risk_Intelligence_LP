// src/hooks/useAllDeviceRisk.ts
import { useQuery } from "@tanstack/react-query";
import { MODE } from "../config/mode";
import { mockRisk } from "../mock/aggregates";

const API_URL = import.meta.env.VITE_API_URL;

export function useAllDeviceRisk(deviceIds: string[]) {
  return useQuery({
    queryKey: ["all-device-risk", deviceIds, MODE],
    enabled: deviceIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        deviceIds.map(async (id) => {
          const data =
            MODE === "mock"
              ? mockRisk
              :  await fetch(`${API_URL}/risk/latest?device_id=${id}`).then((r) =>
                  r.json()
                );

          return { id, data };
        })
      );

      return results;
    },
  });
}