// src/components/PageTransition.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function PageTransition({ children, keyId }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      key={keyId}
      style={{
        opacity: 0,
        transform: "translateY(16px)",
        animation: `pageTransition 0.5s ease-out forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}