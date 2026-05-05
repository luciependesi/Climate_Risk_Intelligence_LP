// frontend/src/components/DeviceMap.tsx
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";

type DevicePoint = {
  id: string;
  lat: number;
  lon: number;
  risk: number | null;
};

const icon = (risk: number | null) =>
  L.divIcon({
    className: "device-marker",
    html: `<div class="marker-dot" data-risk="${risk ?? 0}"></div>`,
    iconSize: [16, 16],
  });

export function DeviceMap({
  devices,
}: {
  devices: DevicePoint[];
}) {
  const center =
    devices.length > 0
      ? [devices[0].lat, devices[0].lon] as [number, number]
      : [40.44, -79.99];

  return (
    <div className="card map-card">
      <div className="card-title">Device Map</div>
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {devices.map((d) => (
            <Marker
              key={d.id}
              position={[d.lat, d.lon]}
              icon={icon(d.risk)}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: "0.8rem" }}>
                    <div><strong>{d.id}</strong></div>
                    <div>Risk: {((d.risk ?? 0) * 100).toFixed(0)}</div>
                  </div>
                </motion.div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}