// src/components/AnimatedClusterOverview.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedClusterOverview({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      className="card"
      style={{
        opacity: 0,
        transform: "translateY(16px)",
        animation: `fadeSlideIn 0.5s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
    >
      {children}
    </div>
  );
}