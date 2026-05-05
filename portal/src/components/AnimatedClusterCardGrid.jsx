// src/components/AnimatedClusterCardGrid.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedClusterCardGrid({
  clusters,
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
      {clusters.map((c, i) => (
        <div
          key={c.cluster_id || i}
          style={{
            opacity: 0,
            transform: "translateY(14px)",
            animation: `fadeSlideIn 0.45s ease-out ${i * delayStep}ms forwards`,
            filter: isVirtual ? "opacity(0.85)" : "none",
          }}
        >
          {renderItem(c, i)}
        </div>
      ))}
    </div>
  );
}