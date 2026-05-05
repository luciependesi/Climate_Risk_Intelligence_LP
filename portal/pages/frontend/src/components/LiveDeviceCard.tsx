//animated risk + health
import React, { useEffect, useState } from "react";
import { useRisk } from "../api/useRisk";
import { useLiveRiskStream } from "../api/useLiveRiskStream";
import { apiGet } from "../api/apiClient";

type Health = {
  battery: number;
  freshness: number;
  sensor_sanity: number;
  overall_health: number;
};

interface Props {
  deviceId: string;
}

export const LiveDeviceCard: React.FC<Props> = ({ deviceId }) => {
  const { risk, loading: riskLoading } = useRisk(deviceId);
  const { latest } = useLiveRiskStream(deviceId);
  const [health, setHealth] = useState<Health | null>(null);

  const displayRisk = latest || risk;

  useEffect(() => {
    apiGet<Health & { device_id: string; timestamp_ms: number }>(
      `/health/${deviceId}`
    ).then((h) => setHealth(h));
  }, [deviceId]);

  if (riskLoading || !displayRisk || !health) return <div>Loading…</div>;

  const riskLevel = Math.round(displayRisk.overall_risk * 100);
  const healthLevel = Math.round(health.overall_health * 100);

  return (
    <div className="card">
      <h3>{deviceId}</h3>
      <div className="metric-row">
        <span>Overall Risk</span>
        <div className="bar">
          <div
            className="bar-fill risk"
            style={{ width: `${riskLevel}%`, transition: "width 0.6s ease" }}
          />
        </div>
        <span>{riskLevel}%</span>
      </div>
      <div className="metric-row">
        <span>Health</span>
        <div className="bar">
          <div
            className="bar-fill health"
            style={{ width: `${healthLevel}%`, transition: "width 0.6s ease" }}
          />
        </div>
        <span>{healthLevel}%</span>
      </div>
      <div className="sub-metrics">
        <div>Flood: {(displayRisk.flood_risk * 100).toFixed(0)}%</div>
        <div>Air: {(displayRisk.air_quality_risk * 100).toFixed(0)}%</div>
        <div>Heat: {(displayRisk.heat_index_risk * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
};