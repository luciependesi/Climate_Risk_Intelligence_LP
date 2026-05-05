import { useRisk } from "../hooks/useAggregates";

interface Props {
  deviceId: string;
}

function riskColor(score: number) {
  if (score >= 80) return "#cf1322";   // high
  if (score >= 50) return "#fa8c16";   // medium
  return "#389e0d";                    // low
}

export function RiskGauge({ deviceId }: Props) {
  const { data, isLoading } = useRisk(deviceId);

  if (!deviceId) return <div>Select a device</div>;
  if (isLoading) return <div>Loading risk score…</div>;

  const latest = data?.[0];
  const score = latest?.risk ?? 0;
  const color = riskColor(score);

  return (
    <div className="card risk-gauge">
      <h3>Risk Score</h3>
      <div
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          color,
        }}
      >
        {Math.round(score)}
      </div>
      <div style={{ marginTop: 8, fontSize: "0.9rem" }}>
        {score >= 80 && "High risk"}
        {score >= 50 && score < 80 && "Moderate risk"}
        {score < 50 && "Low risk"}
      </div>
    </div>
  );
}