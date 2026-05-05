//this component show rhe daily average of temperatures, humidity and pressure for selected decice.
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useDaily } from "../hooks/useAggregates";
import { MODE } from "../config/mode";

interface Props {
  deviceId: string;
}

export function DailyEnvChart({ deviceId }: Props) {
  const { data, isLoading } = useDaily(deviceId);

  if (!deviceId)
    return <div className="card">Select a device to view daily trends</div>;

  if (isLoading)
    return <div className="card">Loading daily environment…</div>;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3>Daily Environment</h3>
        <span className="mode-tag">{MODE.toUpperCase()}</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis
            dataKey="bucket"
            tickFormatter={(v) => new Date(v).toLocaleDateString()}
          />

          <YAxis />

          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleDateString()}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="avg_temp"
            stroke="#ff4d4f"
            dot={false}
            name="Temperature (°C)"
          />

          <Line
            type="monotone"
            dataKey="avg_humidity"
            stroke="#40a9ff"
            dot={false}
            name="Humidity (%)"
          />

          <Line
            type="monotone"
            dataKey="avg_pressure"
            stroke="#73d13d"
            dot={false}
            name="Pressure (hPa)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}