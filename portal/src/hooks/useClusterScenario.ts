import { useScenario } from "../context/ScenarioContext";
import { useClusterRisk } from "./useClusterRisk";
import { useClusterForecast } from "./useClusterForecast";
import { useClusterDemo } from "./useClusterDemo";
import { useClusterWS } from "./useClusterWS";
import mockCluster from "../mock/cluster.json";

export function useClusterScenario() {
  const { mode } = useScenario();

  if (mode === "mock") {
    return { data: mockCluster, forecast: null, isLoading: false, mode };
  }

  if (mode === "demo") {
    return { data: useClusterDemo(), forecast: null, isLoading: false, mode };
  }

  if (mode === "forecast") {
    const risk = useClusterRisk();
    const forecast = useClusterForecast();
    return {
      data: risk.data,
      forecast: forecast.data,
      isLoading: risk.isLoading || forecast.isLoading,
      mode
    };
  }

  if (mode === "live") {
    const risk = useClusterRisk();
    const wsRisk = useClusterWS();
    return {
      data: wsRisk
        ? { ...risk.data, avg_risk: wsRisk }
        : risk.data,
      forecast: null,
      isLoading: risk.isLoading,
      mode
    };
  }
}