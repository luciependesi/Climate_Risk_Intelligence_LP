// src/components/AnimatedTabs.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedTabs({ activeTab, children }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      key={activeTab}
      style={{
        opacity: 0,
        transform: "translateY(10px)",
        animation: `fadeSlideIn 0.45s ease-out forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}