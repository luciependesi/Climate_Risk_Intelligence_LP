// src/components/chart.tsx
import { useHourly } from "../hooks/useAggregates";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { useDeviceContext } from "../context/DeviceContext";
import VirtualBadge from "./VirtualBadge";
import { rollingAverage } from "../utils/smoothing";

export function HourlyAQIChart({ deviceId }: { deviceId: string }) {
  const { data, isLoading } = useHourly(deviceId);
  const { isVirtual } = useDeviceContext();

  if (isLoading) return <SkeletonChart />;

  // Convert hourly aggregate into smoothed series
  const smoothed = rollingAverage(
    data.map((d) => ({
      bucket: d.bucket,
      value: d.avg_mq135,
    })),
    5
  );

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Hourly AQI (MQ135)
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={smoothed}>
          <defs>
            <linearGradient id="aqiHourlyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7300" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ff7300" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="bucket" />
          <YAxis />

          {/* Confidence shading for virtual data */}
          {isVirtual && (
            <Area
              type="monotone"
              dataKey="smoothed"
              fill="url(#aqiHourlyGradient)"
              stroke="none"
            />
          )}

          <Line
            type="monotone"
            dataKey="smoothed"
            stroke={isVirtual ? "#ff9800" : "#ff7300"}
            strokeWidth={2}
            dot={false}
          />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}