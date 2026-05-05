// src/components/AnimatedListItem.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedListItem({
  children,
  delay = 0,
  distance = 10,
}) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      style={{
        opacity: 0,
        transform: `translateY(${distance}px)`,
        animation: `fadeSlideIn 0.45s ease-out ${delay}ms forwards`,
        filter: isVirtual ? "opacity(0.85)" : "none",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}