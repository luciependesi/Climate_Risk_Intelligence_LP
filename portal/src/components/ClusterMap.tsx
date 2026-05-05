// src/components/ClusterMap.tsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useDeviceContext } from "../context/DeviceContext";

// ---------------------------------------------
// Types
// ---------------------------------------------
type Device = {
  device_id: string;
  latitude_deg?: number;
  longitude_deg?: number;
  name?: string;
  is_online?: boolean;
  firmware_ver?: string;
  last_seen?: string;

  // optional sensor fields
  air_quality_raw?: number;
};

// ---------------------------------------------
// Risk color helper
// ---------------------------------------------
const riskColor = (d: Device) => {
  if (!d.is_online) return "#6b7280"; // gray offline
  if (!d.air_quality_raw) return "#16a34a"; // green default

  return d.air_quality_raw > 200
    ? "#dc2626" // red
    : d.air_quality_raw > 120
    ? "#f97316" // orange
    : d.air_quality_raw > 60
    ? "#eab308" // yellow
    : "#16a34a"; // green
};

// ---------------------------------------------
// Leaflet icon generator
// ---------------------------------------------
const makeIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

// ---------------------------------------------
// Fit map to all device markers
// ---------------------------------------------
function FitBounds({ devices }: { devices: Device[] }) {
  const map = useMap();

  useEffect(() => {
    const pts = devices
      .filter((d) => d.latitude_deg && d.longitude_deg)
      .map((d) => [d.latitude_deg!, d.longitude_deg!] as [number, number]);

    if (pts.length > 0) {
      const bounds = L.latLngBounds(pts);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [devices, map]);

  return null;
}

// ---------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------
type Props = {
  onSelectDevice: (device: Device) => void;
};

export function ClusterMap({ onSelectDevice }: Props) {
  const { devices } = useDeviceContext();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[40.44, -79.99]} // Pittsburgh default
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitBounds devices={devices} />

        {devices
          .filter((d) => d.latitude_deg && d.longitude_deg)
          .map((d) => (
            <Marker
              key={d.device_id}
              position={[d.latitude_deg!, d.longitude_deg!]}
              icon={makeIcon(riskColor(d))}
              eventHandlers={{
                click: () => onSelectDevice(d),
              }}
            >
              <Popup>
                <strong>{d.name ?? `Device ${d.device_id}`}</strong>
                <br />
                {d.is_online ? "🟢 Online" : "🔴 Offline"}
                <br />
                Firmware: {d.firmware_ver ?? "—"}
                <br />
                Last seen: {d.last_seen ?? "—"}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}