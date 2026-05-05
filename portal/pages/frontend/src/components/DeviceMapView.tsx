import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useDevices } from "../api/useDevices";
import { useRisk } from "../api/useRisk";

export const DeviceMapView: React.FC = () => {
  const { devices, loading } = useDevices();

  if (loading) return <div>Loading map…</div>;
  if (!devices.length) return <div>No devices</div>;

  const center = [
    devices[0].latitude ?? 40.44,
    devices[0].longitude ?? -79.99,
  ] as [number, number];

  return (
    <MapContainer center={center} zoom={11} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {devices.map((d) => (
        <DeviceMarker key={d.device_id} device={d} />
      ))}
    </MapContainer>
  );
};

const DeviceMarker: React.FC<{ device: any }> = ({ device }) => {
  const { risk } = useRisk(device.device_id);

  const pos: [number, number] = [
    device.latitude ?? 0,
    device.longitude ?? 0,
  ];

  const riskPct = risk ? Math.round(risk.overall_risk * 100) : null;

  return (
    <Marker position={pos}>
      <Popup>
        <div>
          <strong>{device.name || device.device_id}</strong>
          <br />
          {riskPct !== null ? `Risk: ${riskPct}%` : "No risk data"}
        </div>
      </Popup>
    </Marker>
  );
};