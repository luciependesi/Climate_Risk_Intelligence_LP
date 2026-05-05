// src/components/AnimatedRoute.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedRoute({ children, keyId }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      key={keyId}
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        animation: `pageTransition 0.55s ease-out forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}