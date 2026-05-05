// src/components/DeviceDrawer.jsx
import React from "react";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";

export function DeviceDrawer({ deviceId, onClose }) {
  const { latestReading, isVirtual } = useDeviceContext();

  if (!deviceId || !latestReading) return null;

  return (
    <div className="drawer">
      <div className="drawer-header flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Device {deviceId}
          <VirtualBadge isVirtual={isVirtual} />
        </h2>

        <button onClick={onClose} className="drawer-close">
          ✕
        </button>
      </div>

      <ConfidenceIndicator isVirtual={isVirtual} />

      <div className="drawer-content mt-4 grid grid-cols-2 gap-4">
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

// ⭐ Provide default export too
export default DeviceDrawer;