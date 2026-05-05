// src/components/StaggerList.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function StaggerList({
  items,
  renderItem,
  delayStep = 60,
}) {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="w-full">
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            opacity: 0,
            transform: "translateY(10px)",
            animation: `fadeSlideIn 0.45s ease-out ${i * delayStep}ms forwards`,
            filter: isVirtual ? "opacity(0.85)" : "none",
          }}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}