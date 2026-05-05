// src/pages/DeviceDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function DeviceDetails() {
  const { deviceId } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Device {deviceId}</h1>
      <p>Detailed analytics, risk history, and sensor trends will appear here.</p>
    </div>
  );
}