//global risk heatmap component using react-leaflet.
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useDevices } from "../hooks/useDevices";
import { useRisk } from "../hooks/useAggregates";
import "leaflet/dist/leaflet.css";

function riskColor(score: number) {
  if (score >= 80) return "#cf1322";
  if (score >= 50) return "#fa8c16";
  return "#389e0d";
}

export function GlobalRiskHeatmap() {
  const { data: devices } = useDevices();

  return (
    <div className="card" style={{ height: "80vh" }}>
      <h3>Global Risk Heatmap</h3>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "90%", width: "100%", borderRadius: 8 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {devices?.map((d: any) => {
          const { data: riskData } = useRisk(d.id);
          const score = riskData?.[0]?.risk ?? 0;

          return (
            <CircleMarker
              key={d.id}
              center={[d.latitude, d.longitude]}
              radius={10}
              pathOptions={{
                color: riskColor(score),
                fillColor: riskColor(score),
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <strong>{d.name ?? d.id}</strong>
                <br />
                Risk: {score}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}