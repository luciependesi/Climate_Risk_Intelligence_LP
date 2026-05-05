import { useDeviceContext } from "../context/DeviceContext";

export default function DeviceDetailDrawer() {
  const {
    selectedDevice,
    latestReading,
    risk,
    health,
    online,
    lastSeen,
    isVirtual,
  } = useDeviceContext();

  if (!selectedDevice) return null;

  return (
    <div className="device-detail-drawer">
      <h3>Device Details</h3>

      <div className="row">
        <strong>Status:</strong> {online ? "Online" : "Offline"}
      </div>

      <div className="row">
        <strong>Last Seen:</strong> {lastSeen}
      </div>

      {isVirtual && (
        <div className="row">
          <strong>Mode:</strong> Virtual Device
        </div>
      )}

      <h4>Latest Reading</h4>
      <pre>{JSON.stringify(latestReading, null, 2)}</pre>

      <h4>Risk</h4>
      <pre>{JSON.stringify(risk, null, 2)}</pre>

      <h4>Health</h4>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
}