// src/components/DeviceOverview.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import ConfidenceIndicator from "./ConfidenceIndicator";
import VirtualBadge from "./VirtualBadge";

export default function DeviceOverview() {
  const { latestReading, isVirtual, confidence } = useDeviceContext();

  if (!latestReading) {
    return <div className="card">Loading device data…</div>;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="card-title">
          Device Overview
          <VirtualBadge isVirtual={isVirtual} />
        </h2>
        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <strong>Temperature:</strong> {latestReading.temperature_c?.toFixed(2)} °C
        </div>
        <div>
          <strong>Humidity:</strong> {latestReading.humidity_percent?.toFixed(2)} %
        </div>
        <div>
          <strong>Pressure:</strong> {latestReading.pressure_hpa?.toFixed(2)} hPa
        </div>
        <div>
          <strong>Air Quality:</strong> {latestReading.air_quality_raw}
        </div>
        <div>
          <strong>Water Level:</strong> {latestReading.water_level_raw}
        </div>
        <div>
          <strong>Battery:</strong> {latestReading.battery_mv} mV
        </div>
      </div>
    </div>
  );
}