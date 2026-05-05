// src/components/ClusterRiskStoryboard.jsx
import React, { useState } from "react";
import ClusterRiskCard from "./ClusterRiskCard";
import ClusterRiskTimeline from "./ClusterRiskTimeline";
import ClusterRiskAlerts from "./ClusterRiskAlerts";
import { useClusterRisk } from "../hooks/useClusterRisk";
import { useClusterAnomalies } from "../hooks/useClusterAnomalies";

const steps = ["now", "trend", "anomalies", "forecast"];

export default function ClusterRiskStoryboard({ forecast }) {
  const [step, setStep] = useState("now");
  const { data } = useClusterRisk();
  const { data: anomalyData } = useClusterAnomalies();

  if (!data) return null;

  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#fff" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {steps.map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid #ddd",
              background: step === s ? "#eee" : "#fff",
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ transition: "all 0.4s ease" }}>
        {step === "now" && (
          <ClusterRiskCard
            avgRisk={data.avg_risk}
            deviceCount={data.device_count}
            trend={data.trend}
          />
        )}

        {step === "trend" && <ClusterRiskTimeline data={data.trend} />}

        {step === "anomalies" && anomalyData && (
          <ClusterRiskAlerts
            avgRisk={data.avg_risk}
            perDevice={data.per_device}
            trend={anomalyData.series}
          />
        )}

        {step === "forecast" && (
          <div className="card" style={{ padding: 16 }}>
            <h3>Next‑Hour Forecast</h3>
            <p style={{ fontSize: 32, margin: "8px 0" }}>
              {forecast?.next_hour_risk != null
                ? Math.round(forecast.next_hour_risk)
                : "—"}
            </p>
            <p style={{ opacity: 0.7 }}>
              Model‑estimated cluster risk for the next hour.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}