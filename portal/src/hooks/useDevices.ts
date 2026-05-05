import { useQuery } from "@tanstack/react-query";
import { fetchDevices } from "../services/devices";

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });
}