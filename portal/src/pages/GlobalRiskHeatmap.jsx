// src/pages/GlobalRiskHeatmap.jsx
import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

import { useDeviceContext } from "../context/DeviceContext";

export default function GlobalRiskHeatmap() {
  const { devices, setSelectedDeviceId } = useDeviceContext();
  const deviceList = Object.values(devices);

  if (deviceList.length === 0) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        No devices online.
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-semibold mb-4">Global Risk Heatmap</h2>

      <MapContainer
        center={[40.44, -79.99]}
        zoom={11}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg shadow"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {deviceList.map((d) => {
          const risk = d.latest_reading?.risk_score_unified ?? 0;

          const color =
            risk < 30
              ? "green"
              : risk < 60
              ? "yellow"
              : "red";

          return (
            <CircleMarker
              key={d.device_id}
              center={[d.lat, d.lon]}
              radius={10}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
              eventHandlers={{
                click: () => setSelectedDeviceId(d.device_id),
              }}
            >
              <Tooltip>
                <div>
                  <strong>{d.device_id}</strong>
                  <br />
                  Risk: {risk.toFixed(1)}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}