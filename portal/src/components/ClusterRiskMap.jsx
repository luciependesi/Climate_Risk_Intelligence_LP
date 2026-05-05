// src/components/ClusterRiskMap.jsx
import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";

export default function ClusterRiskMap({ devices }) {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="card">
      <h3 className="card-title flex items-center gap-2">
        Cluster Risk Map
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <MapContainer
        center={[40.44, -79.99]}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {devices.map((d) => {
          const score = d.risk_score_unified ?? 0;

          const color =
            score < 30
              ? "#4caf50"
              : score < 60
              ? "#ff9800"
              : "#f44336";

          return (
            <CircleMarker
              key={d.device_id}
              center={[d.latitude_deg, d.longitude_deg]}
              radius={10}
              pathOptions={{
                color,
                fillColor: isVirtual ? "#ff9800" : color,
                fillOpacity: isVirtual ? 0.4 : 0.7,
              }}
            >
              <Tooltip>
                <div>
                  <strong>Device {d.device_id}</strong>
                  <br />
                  Risk: {score.toFixed(1)}
                  <br />
                  {isVirtual ? "Virtual data" : "Real data"}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}