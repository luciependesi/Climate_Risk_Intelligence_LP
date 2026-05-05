//shows a line chart of the last 24 hours of AQI readings from the MQ135 sensor for a give device ID.
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
  Area,
} from "recharts";

type Props = {
  deviceId: string;
};

type Reading = {
  timestamp_ms: number;
  air_quality_raw: number | null;
};

export function HourlyAQIChart({ deviceId }: Props) {
  const [data, setData] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!deviceId) return;

    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/readings?device_id=${deviceId}&limit=24`
        );
        if (!res.ok) return;

        const rows = await res.json();

        const sorted = [...rows]
          .map((r: any) => ({
            timestamp_ms: r.timestamp_ms,
            air_quality_raw: r.air_quality_raw,
          }))
          .sort((a, b) => a.timestamp_ms - b.timestamp_ms);

        // ⭐ Compute rolling risk (simple normalized AQI)
        const risk = sorted.map((r) => {
          const aqi = r.air_quality_raw ?? 0;
          // Normalize 0–300 → 0–1
          const score = Math.min(aqi / 300, 1);
          return { ...r, risk_score: score };
        });

        setData(risk);
      } catch (err) {
        console.error("Failed to fetch AQI history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Hourly Air Quality (MQ135)</h3>

      {loading && data.length === 0 && (
        <p className="text-gray-400 italic">Loading…</p>
      )}

      {!loading && data.length === 0 && (
        <p className="text-gray-400 italic">No readings yet.</p>
      )}

      {data.length > 0 && (
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

              {/* X-axis */}
              <XAxis
                dataKey="timestamp_ms"
                tickFormatter={(t) => new Date(t).toLocaleTimeString()}
              />

              {/* Y-axis */}
              <YAxis domain={[0, 300]} />

              {/* Tooltip */}
              <Tooltip
                labelFormatter={(t) => new Date(t).toLocaleString()}
                formatter={(v) => (v ?? "—").toString()}
              />

              {/* ⭐ EPA AQI Threshold Bands */}
              <ReferenceArea y1={0} y2={50} fill="#22c55e" fillOpacity={0.15} />
              <ReferenceArea y1={51} y2={100} fill="#eab308" fillOpacity={0.15} />
              <ReferenceArea y1={101} y2={150} fill="#f97316" fillOpacity={0.15} />
              <ReferenceArea y1={151} y2={200} fill="#dc2626" fillOpacity={0.15} />
              <ReferenceArea y1={201} y2={300} fill="#9333ea" fillOpacity={0.15} />

              {/* ⭐ 24‑hour rolling risk overlay */}
              <Area
                type="monotone"
                dataKey="risk_score"
                name="Risk (normalized)"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.12}
                yAxisId={0}
              />

              {/* AQI Line */}
              <Line
                type="monotone"
                dataKey="air_quality_raw"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
                name="AQI"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}