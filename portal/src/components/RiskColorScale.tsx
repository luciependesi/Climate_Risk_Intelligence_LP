// src/components/RiskColorScale.tsx
import React from "react";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import { useDeviceContext } from "../context/DeviceContext";

export function RiskColorScale() {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="card fade" style={{ padding: 12 }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="card-title flex items-center gap-2">
          Risk Scale
          <VirtualBadge isVirtual={isVirtual} />
        </h3>

        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 8,
          opacity: isVirtual ? 0.75 : 1, // ⭐ virtual-aware shading
        }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#389e0d",
            }}
          />
          <span>Low (0–49)</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fa8c16",
            }}
          />
          <span>Moderate (50–79)</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#cf1322",
            }}
          />
          <span>High (80–100)</span>
        </div>
      </div>
    </div>
  );
}