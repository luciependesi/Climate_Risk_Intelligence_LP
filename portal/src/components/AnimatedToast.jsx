// src/components/AnimatedToast.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedToast({ children, visible }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.35s ease-out",
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="toast-container"
    >
      {children}
    </div>
  );
}