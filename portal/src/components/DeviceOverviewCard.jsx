// this component shows a summary of the device's latest reading and health status.
// src/components/DeviceOverviewCard.jsx
import { useDeviceContext } from "../context/DeviceContext";

export default function DeviceOverviewCard() {
  const { selectedDevice, latestReading, online, lastSeen, isVirtual } =
    useDeviceContext();

  if (!selectedDevice) return null;

  return (
    <div className="device-overview-card">
      <h2>{selectedDevice.device_id}</h2>

      <div className="status-row">
        <span className={online ? "dot-online" : "dot-offline"} />
        <span>{online ? "Online" : "Offline"}</span>
        {isVirtual && <span className="virtual-tag">Virtual</span>}
      </div>

      <div className="meta">
        <div>Last seen: {lastSeen || "—"}</div>
        <div>Battery: {latestReading?.battery_v ?? "—"} V</div>
        <div>RSSI: {latestReading?.rssi ?? "—"} dBm</div>
      </div>

      <div className="gnss">
        <div>Lat: {latestReading?.latitude ?? "—"}</div>
        <div>Lon: {latestReading?.longitude ?? "—"}</div>
        <div>Alt: {latestReading?.altitude ?? "—"} m</div>
        <div>HDOP: {latestReading?.hdop ?? "—"}</div>
      </div>
    </div>
  );
}