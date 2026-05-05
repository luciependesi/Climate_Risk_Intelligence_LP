// src/components/AnimatedRiskGauge.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedRiskGauge({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: 0,
        transform: "scale(0.95)",
        animation: `gaugePop 0.45s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full flex justify-center"
    >
      {children}
    </div>
  );
}