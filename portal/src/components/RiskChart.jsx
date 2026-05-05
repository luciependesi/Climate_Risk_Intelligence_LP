// src/components/RiskCard.jsx
export default function RiskCard({ risk }) {
  if (!risk) return null;
  const score = risk.risk_score_unified;
  let color = "var(--accent)";
  if (score >= 80) color = "var(--critical)";
  else if (score >= 60) color = "var(--warning)";

  return (
    <div className="card">
      <div className="card-title">Unified Risk Score</div>
      <div style={{ fontSize: "2.5rem", fontWeight: 600, color }}>
        {Math.round(score)}
      </div>
      <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
        Level: {risk.risk_level} · Model: {Math.round(risk.risk_score_model)}
      </div>
    </div>
  );
}