function DeviceCard({ reading }) {
  if (!reading) return <div className="card skeleton">Waiting for data…</div>;

  return (
    <div className="card">
      <h3>Device #{reading.device_id}</h3>
      <p>Temp: {reading.temperature_c?.toFixed(1)} °C</p>
      <p>Humidity: {reading.humidity?.toFixed(1)} %</p>
      <p>Pressure: {reading.pressure_hpa?.toFixed(1)} hPa</p>
      <p>Air quality (raw): {reading.air_quality_raw?.toFixed(0)}</p>
      <p>Battery: {(reading.battery_mv / 1000).toFixed(2)} V</p>
      <p>
        Location: {reading.latitude_deg?.toFixed(4)},{" "}
        {reading.longitude_deg?.toFixed(4)}
      </p>
      <p>
        Time: {new Date(reading.timestamp_ms).toLocaleString()}
      </p>
    </div>
  );
}