// frontend/src/hooks/useSensorData.ts
//Animated React hook 
import { useEffect, useState } from "react";
import {
  fetchSensorLatest,
  fetchRiskScore,
  Mode,
  SensorReading,
} from "../api/sensor";

const cluster = await fetchClusterRisk(["esp32_001", "esp32_002"]);
const health = await fetchHealth("esp32_001");

type State = {
  data: SensorReading | null;
  loading: boolean;
  error: string | null;
  riskScore: number | null;
  prevRiskScore: number | null;
};

export function useSensorData(mode: Mode, deviceId: string, refreshMs = 8000) {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
    riskScore: null,
    prevRiskScore: null,
  });

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const load = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const [latest, risk] = await Promise.all([
          fetchSensorLatest(mode, deviceId),
          fetchRiskScore(mode, deviceId),
        ]);

        if (cancelled) return;

        setState(prev => ({
          ...prev,
          data: latest,
          loading: false,
          error: null,
          prevRiskScore: prev.riskScore,
          riskScore: risk.risk_score,
        }));
      } catch (err: any) {
        if (cancelled) return;
        setState(prev => ({
          ...prev,
          loading: false,
          error: err?.message ?? "Error loading sensor data",
        }));
      } finally {
        if (!cancelled) {
          timer = window.setTimeout(load, refreshMs);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [mode, deviceId, refreshMs]);

  return state;
}