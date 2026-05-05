// src/components/SensorCard.jsx
import React from "react";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import { useDeviceContext } from "../context/DeviceContext";

export default function SensorCard({ title, value, unit }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="card-title">
          {title}
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <p className="text-2xl font-semibold mt-2">
        {value} {unit}
      </p>
    </div>
  );
}