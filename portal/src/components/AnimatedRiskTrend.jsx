// src/components/AnimatedRiskTrend.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedRiskTrend({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: 0,
        transform: "translateY(12px)",
        animation: `fadeSlideIn 0.5s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}