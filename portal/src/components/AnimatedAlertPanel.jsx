// src/components/AnimatedAlertPanel.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedAlertPanel({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      className="card"
      style={{
        opacity: 0,
        transform: "translateY(12px)",
        animation: `fadeSlideIn 0.45s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
    >
      {children}
    </div>
  );
}