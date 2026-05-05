// src/components/AnimatedDrawer.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedDrawer({ open, children }) {
  const { isVirtual } = useDeviceContext();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end"
      style={{
        animation: `fadeIn 0.35s ease-out forwards`,
        background: "rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          transform: "translateY(20px)",
          opacity: 0,
          animation: `drawerSlideUp 0.45s ease-out forwards`,
          filter: isVirtual ? "opacity(0.85)" : "none",
        }}
        className="w-full bg-white dark:bg-gray-800 p-6 rounded-t-xl shadow-xl"
      >
        {children}
      </div>
    </div>
  );
}