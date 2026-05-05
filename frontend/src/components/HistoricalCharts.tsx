// frontend/src/components/HistoricalCharts.tsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function HistoricalCharts({ history, loading, data }) {
  if (loading || !data) {
    return (
      <div className="card">
        <div className="card-title">Historical Metrics</div>
        <div className="skeleton" style={{ height: "200px", width: "100%" }} />
      </div>
    );
  }

  const chartData = history.map((risk, i) => ({
    index: i,
    temperature: data.temperature_c ?? 0,
    humidity: data.humidity_percent ?? 0,
    aqi: data.air_quality_raw ?? 0,
    rainfall: data.rain_level_raw ?? 0,
  }));

  return (
    <div className="card">
      <div className="card-title">Historical Metrics</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis dataKey="index" hide />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#ff6b6b" dot={false} />
          <Line type="monotone" dataKey="humidity" stroke="#4dabf7" dot={false} />
          <Line type="monotone" dataKey="aqi" stroke="#ffa94d" dot={false} />
          <Line type="monotone" dataKey="rainfall" stroke="#74c0fc" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}