// src/components/FadeIn.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function FadeIn({ children, delay = 0 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: 0,
        animation: `fadeIn 0.45s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}