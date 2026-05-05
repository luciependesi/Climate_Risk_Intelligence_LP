// shows the risk score trend for a device based on the latest risk score fetched from the backend.
// src/components/RiskTrendCard.jsx
import { useDeviceContext } from "../context/DeviceContext";

export default function RiskTrendCard() {
  const { risk } = useDeviceContext();

  if (!risk) return null;

  return (
    <div className="risk-trend-card">
      <h3>Risk Score</h3>
      <div className="risk-score">{risk.score}</div>
      <div className="risk-details">
        <pre>{JSON.stringify(risk, null, 2)}</pre>
      </div>
    </div>
  );
}