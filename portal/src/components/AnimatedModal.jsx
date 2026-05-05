// src/components/AnimatedModal.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedModal({ open, children }) {
  const { isVirtual } = useDeviceContext();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        animation: `fadeIn 0.35s ease-out forwards`,
        background: "rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          opacity: 0,
          transform: "scale(0.95)",
          animation: `modalPop 0.4s ease-out forwards`,
          filter: isVirtual ? "opacity(0.85)" : "none",
        }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
      >
        {children}
      </div>
    </div>
  );
}