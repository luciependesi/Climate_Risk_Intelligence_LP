// src/components/ClusterRiskMapOverlay.jsx
import React from "react";
import { CircleMarker, Tooltip } from "react-leaflet";

function riskColor(risk) {
  if (risk >= 80) return "#cf1322";
  if (risk >= 50) return "#fa8c16";
  return "#389e0d";
}

export default function ClusterRiskMapOverlay({ devices }) {
  return (
    <>
      {devices.map((d) => (
        <CircleMarker
          key={d.device_id}
          center={[d.lat, d.lng]}
          radius={10}
          color={riskColor(d.risk)}
          fillOpacity={0.6}
        >
          <Tooltip>
            <div>
              <strong>{d.device_id}</strong>
              <br />
              Risk: {d.risk}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}