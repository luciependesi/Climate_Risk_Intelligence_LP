// src/components/AnimatedDeviceList.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedDeviceList({
  devices,
  renderItem,
  delayStep = 60,
}) {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="w-full">
      {devices.map((d, i) => (
        <div
          key={d.device_id || i}
          style={{
            opacity: 0,
            transform: "translateY(10px)",
            animation: `fadeSlideIn 0.45s ease-out ${i * delayStep}ms forwards`,
            filter: isVirtual ? "opacity(0.85)" : "none",
          }}
        >
          {renderItem(d, i)}
        </div>
      ))}
    </div>
  );
}