// displays the clusters in a grid format, showing the number of devices in each cluster and Live stream Links.
import { useDeviceContext } from "../context/DeviceContext";

export default function ClusterGrid() {
  const { devices } = useDeviceContext();

  return (
    <div className="cluster-grid">
      {devices.map((d) => (
        <div key={d.device_id} className="cluster-card">
          <h4>{d.device_id}</h4>

          <div className="status">
            <span className={d.online ? "dot-online" : "dot-offline"} />
            {d.online ? "Online" : "Offline"}
          </div>

          <div className="meta">
            <div>Last seen: {d.last_seen}</div>
            <div>Lat: {d.latitude ?? "—"}</div>
            <div>Lon: {d.longitude ?? "—"}</div>
            {d.is_virtual && <div className="virtual-tag">Virtual</div>}
          </div>
        </div>
      ))}
    </div>
  );
}