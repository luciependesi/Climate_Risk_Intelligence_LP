// this component displays the latest data from a live device stream, using the useLiveDeviceStream hook to subscribe to updates and render the last receiver data.
// src/components/LiveDeviceCard.jsx
import { useDeviceContext } from "../context/DeviceContext";

export default function LiveDeviceCard() {
  const { latestReading, online } = useDeviceContext();

  if (!latestReading) return null;

  return (
    <div className="live-device-card">
      <div className="header">
        <span className={online ? "dot-online" : "dot-offline"} />
        <h3>Live Data</h3>
      </div>

      <div className="metrics">
        <div>Temp: {latestReading.temperature_c} °C</div>
        <div>Humidity: {latestReading.humidity} %</div>
        <div>Pressure: {latestReading.pressure_hpa} hPa</div>
        <div>Gas: {latestReading.mq135_ppm} ppm</div>
        <div>Water: {latestReading.water_level}</div>
        <div>Battery: {latestReading.battery_v} V</div>
      </div>
    </div>
  );
}