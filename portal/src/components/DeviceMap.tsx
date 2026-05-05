//diplays devices on a map, allows clicking to select a device
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useDevices } from "../hooks/useDevices";
import "leaflet/dist/leaflet.css";

export function DeviceMap({ onSelect }: any) {
  const { data: devices } = useDevices();

  return (
    <div className="card" style={{ height: 300 }}>
      <h3>Device Map</h3>

      <MapContainer
        center={[40.44, -79.99]} // Pittsburgh default
        zoom={11}
        style={{ height: "240px", width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {devices?.map((d: any) => (
          <Marker
            key={d.id}
            position={[d.latitude, d.longitude]}
            eventHandlers={{
              click: () => onSelect(d.id),
            }}
          >
            <Popup>
              <strong>{d.name ?? d.id}</strong>
              <br />
              {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}