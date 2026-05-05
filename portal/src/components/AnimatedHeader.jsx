// src/components/AnimatedHeader.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedHeader({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: 0,
        transform: "translateY(8px)",
        animation: `fadeSlideIn 0.4s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}