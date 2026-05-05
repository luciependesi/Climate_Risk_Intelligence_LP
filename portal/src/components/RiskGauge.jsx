//A circular gauge showing risk score (0–100) with color coding (green for low, yellow for meduim, red for high).
// src/components/RiskGauge.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";

function RiskGauge() {
  const { latestReading, isVirtual } = useDeviceContext();

  if (!latestReading || latestReading.risk_score_unified === undefined) {
    return (
      <div className="card fade">
        <h3 className="card-title">Risk Gauge</h3>
        <p className="text-gray-400 italic">No data yet.</p>
      </div>
    );
  }

  const score = latestReading.risk_score_unified;
  const angle = (score / 100) * 180 - 90; // -90° to +90°
  const color = score < 30 ? "#4caf50" : score < 60 ? "#ff9800" : "#f44336";

  return (
    <div className="card fade flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="card-title flex items-center gap-2">
          Risk Gauge
          <VirtualBadge isVirtual={isVirtual} />
        </h3>

        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <div
        style={{
          width: "160px",
          height: "80px",
          borderTopLeftRadius: "160px",
          borderTopRightRadius: "160px",
          border: `10px solid ${color}`,
          borderBottom: "none",
          position: "relative",
        }}
      >
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "50%",
            width: "4px",
            height: "70px",
            background: color,
            transformOrigin: "bottom center",
            transform: `rotate(${angle}deg)`,
            transition: "transform 0.6s ease-out",
          }}
        />

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            bottom: "-6px",
            left: "calc(50% - 6px)",
            width: "12px",
            height: "12px",
            background: color,
            borderRadius: "50%",
          }}
        />
      </div>

      <p className="text-3xl font-bold mt-3" style={{ color }}>
        {score.toFixed(1)}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {isVirtual ? "Virtual data — lower confidence" : "Real sensor data"}
      </p>
    </div>
  );
}

// ⭐ Export both ways so ALL imports work
export { RiskGauge };
export default RiskGauge;