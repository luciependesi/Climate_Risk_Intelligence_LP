// src/components/DeviceOverviewPanel.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";

function DeviceOverviewPanel() {
  const { latestReading, isVirtual } = useDeviceContext();

  if (!latestReading) {
    return (
      <div className="card fade">
        <h3 className="card-title">Device Overview</h3>
        <p className="text-gray-400 italic">Waiting for data…</p>
      </div>
    );
  }

  return (
    <div className="card fade">
      <div className="flex items-center justify-between mb-2">
        <h3 className="card-title flex items-center gap-2">
          Device Overview
          <VirtualBadge isVirtual={isVirtual} />
        </h3>

        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div><strong>Temperature:</strong> {latestReading.temperature_c?.toFixed(2)} °C</div>
        <div><strong>Humidity:</strong> {latestReading.humidity_percent?.toFixed(2)} %</div>
        <div><strong>Pressure:</strong> {latestReading.pressure_hpa?.toFixed(2)} hPa</div>
        <div><strong>Air Quality:</strong> {latestReading.air_quality_raw}</div>
        <div><strong>Rain Level:</strong> {latestReading.rain_level_raw}</div>
        <div><strong>Water Level:</strong> {latestReading.water_level_raw}</div>
        <div><strong>Battery:</strong> {latestReading.battery_mv} mV</div>
        <div><strong>GPS:</strong> {latestReading.latitude_deg}, {latestReading.longitude_deg}</div>
      </div>
    </div>
  );
}

// ⭐ Export both ways
export { DeviceOverviewPanel };
export default DeviceOverviewPanel;