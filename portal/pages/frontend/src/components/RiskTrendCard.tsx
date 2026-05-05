// frontend/src/components/RiskTrendCard.tsx
//Shows sparkline + trend arrow + last N risk scores.

import { RiskSparkline } from "./RiskSparkline";
import { getTrendArrow } from "../utils/trend";

export function RiskTrendCard({
  history,
  loading,
}: {
  history: number[];
  loading: boolean;
}) {
  const prev = history[history.length - 2] ?? null;
  const current = history[history.length - 1] ?? null;
  const arrow = getTrendArrow(prev, current);

  return (
    <div className="card risk-trend-card">
      <div className="card-title">Risk Trend</div>

      {loading ? (
        <div className="skeleton" style={{ height: "2rem", width: "50%" }} />
      ) : (
        <div className="trend-arrow">{arrow}</div>
      )}

      <RiskSparkline values={history} />
    </div>
  );
}