// src/components/RiskCard.jsx
import { useEffect, useRef, useState } from "react";

export default function RiskCard({ risk, loading }) {
  function getRiskColor(score) {
    if (score >= 80) return "status-red";
    if (score >= 60) return "status-yellow";
    return "status-green";
  }

  if (loading) {
    return (
      <div className="card fade">
        <div className="card-title">Unified Risk Score</div>
        <div className="skeleton" style={{ height: "2rem", width: "50%" }} />
      </div>
    );
  }

  if (!risk) {
    return <div className="card fade">No risk data available</div>;
  }

  return (
    <div className="card fade">
      <div className="card-title">Unified Risk Score</div>

      <h1 className={getRiskColor(risk.score)} style={{ fontSize: "3rem" }}>
        {risk.score}
      </h1>

      <p>
        Level: {risk.level} · Model: {risk.model_score}
      </p>
    </div>
  );
}