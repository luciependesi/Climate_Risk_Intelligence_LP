// src/components/AnimatedGrid.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedGrid({
  items,
  renderItem,
  columns = 3,
  delayStep = 70,
}) {
  const { isVirtual } = useDeviceContext();

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            opacity: 0,
            transform: "translateY(12px)",
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