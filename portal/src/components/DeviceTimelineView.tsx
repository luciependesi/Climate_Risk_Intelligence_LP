import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

type Props = {
  deviceId: string;
};

type Reading = {
  timestamp_ms: number;
  air_quality_raw: number | null;
  rain_level_raw: number | null;
  water_level_raw: number | null;
  battery_mv: number | null;
  risk_score?: number | null; // optional if you add risk later
};

export function DeviceTimelineView({ deviceId }: Props) {
  const [data, setData] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;

    setLoading(true);
    fetch(`/api/readings?device_id=${deviceId}&limit=500`)
      .then((r) => r.json())
      .then((rows) => {
        const sorted = [...rows].sort(
          (a, b) => a.timestamp_ms - b.timestamp_ms
        );
        setData(sorted);
      })
      .finally(() => setLoading(false));
  }, [deviceId]);

  if (!deviceId) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6,
        }}
      >
        Select a device to view timeline
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6,
        }}
      >
        Loading timeline…
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 360 }}>
      <h3 style={{ marginBottom: 8 }}>Device Timeline</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis
            dataKey="timestamp_ms"
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
          />

          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />

          <Tooltip
            labelFormatter={(t) => new Date(t).toLocaleString()}
            formatter={(value) => (value ?? "—").toString()}
          />

          <Legend />

          {/* AQI */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="air_quality_raw"
            name="Air Quality"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
          />

          {/* Rain */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rain_level_raw"
            name="Rain Level"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />

          {/* Water Level */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="water_level_raw"
            name="Water Level"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />

          {/* Battery */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="battery_mv"
            name="Battery (mV)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
          />

          {/* Optional: Risk overlay */}
          {data.some((d) => d.risk_score !== undefined) && (
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="risk_score"
              name="Risk Score"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.15}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}