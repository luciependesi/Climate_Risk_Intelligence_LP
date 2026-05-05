// src/components/AnimatedMetricCard.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedMetricCard({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      className="card"
      style={{
        opacity: 0,
        transform: "translateY(14px)",
        animation: `fadeSlideIn 0.5s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
    >
      {children}
    </div>
  );
}