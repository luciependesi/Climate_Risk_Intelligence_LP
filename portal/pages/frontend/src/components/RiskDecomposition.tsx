// frontend/src/components/RiskDecomposition.tsx

export function RiskDecomposition({ reading, riskScore, loading }) {
  if (loading || !reading) {
    return (
      <div className="card">
        <div className="card-title">Risk Decomposition</div>
        <div className="skeleton" style={{ height: "120px", width: "100%" }} />
      </div>
    );
  }

  const factors = [
    { label: "Temperature", value: reading.temperature_c, weight: 0.25 },
    { label: "Humidity", value: reading.humidity_percent, weight: 0.15 },
    { label: "Air Quality", value: reading.air_quality_raw, weight: 0.25 },
    { label: "Rainfall", value: reading.rain_level_raw, weight: 0.10 },
    { label: "Water Level", value: reading.water_level_raw, weight: 0.10 },
    { label: "Battery", value: reading.battery_mv, weight: 0.10 },
  ];

  return (
    <div className="card">
      <div className="card-title">Risk Decomposition</div>

      <div className="risk-decomp-list">
        {factors.map((f, i) => (
          <div key={i} className="risk-decomp-row">
            <span>{f.label}</span>
            <span className="risk-decomp-value">{f.value}</span>
            <span className="risk-decomp-weight">{(f.weight * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}