// src/components/AnimatedSidebarMenu.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";

export default function AnimatedSidebarMenu({
  items,
  onSelect,
  active,
  delayStep = 60,
}) {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="flex flex-col w-full">
      {items.map((item, i) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            opacity: 0,
            transform: "translateX(-12px)",
            animation: `fadeSlideIn 0.45s ease-out ${i * delayStep}ms forwards`,
            filter: isVirtual ? "opacity(0.85)" : "none",
            cursor: "pointer",
            padding: "10px 14px",
            borderRadius: 8,
            background:
              active === item.id
                ? "rgba(88,166,255,0.15)"
                : "rgba(255,255,255,0.05)",
            border:
              active === item.id ? "1px solid #58a6ff" : "1px solid #333",
            marginBottom: 6,
            transition: "background 0.2s ease",
          }}
          className="hover:bg-gray-700"
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}