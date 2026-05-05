// Chart to show the hourly average temperature for the last 7 days for a given device.
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useHourlyAggregates } from "../hooks/useAggregates";

interface Props {
  deviceId?: string;
}

export const TemperatureHistoryChart: React.FC<Props> = ({ deviceId }) => {
  const { data, loading } = useHourlyAggregates(deviceId, 168);

  if (loading) return <div>Loading temperature history…</div>;
  if (!data.length) return <div>No data yet.</div>;

  const chartData = data
    .slice()
    .reverse()
    .map((d) => ({
      time: d.bucket,
      temp: d.avg_temperature_c,
    }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Hourly Temperature (last 7 days)</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="time" tick={false} />
          <YAxis unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};