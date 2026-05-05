export function LiveReadingCard({ reading }: any) {
  if (!reading) return <div>No live data yet…</div>;

  return (
    <div className="card">
      <h3>{reading.device_id}</h3>
      <p>Temp: {reading.temperature_c}°C</p>
      <p>Humidity: {reading.humidity_pct}%</p>
      <p>Pressure: {reading.pressure_hpa} hPa</p>
    </div>
  );
}