// src/components/SlideIn.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function SlideIn({ children, delay = 0, distance = 12 }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: 0,
        transform: `translateY(${distance}px)`,
        animation: `slideIn 0.45s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}