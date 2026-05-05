// this component  is a plsceholder for a future map visualization of device locations.
// src/components/DeviceMap.jsx
import { useDeviceContext } from "../context/DeviceContext";

export default function DeviceMap() {
  const { selectedDevice, latestReading } = useDeviceContext();

  if (!selectedDevice) return null;

  const lat = latestReading?.latitude;
  const lon = latestReading?.longitude;

  if (!lat || !lon) {
    return <div>No GNSS data available</div>;
  }

  return (
    <div className="device-map">
      {/* Replace with your map library */}
      <div>Map centered at {lat}, {lon}</div>
    </div>
  );
}