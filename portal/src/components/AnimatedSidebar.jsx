// src/components/AnimatedSidebar.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedSidebar({ open, children }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        transform: open ? "translateX(0)" : "translateX(-20px)",
        opacity: open ? 1 : 0,
        transition: "all 0.45s ease-out",
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}