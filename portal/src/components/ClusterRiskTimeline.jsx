// src/components/ClusterRiskTimeline.jsx
import React from "react";
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

export default function ClusterRiskTimeline({ clusterHistory }) {
  const { isVirtual } = useDeviceContext();

  if (!clusterHistory || clusterHistory.length === 0) {
    return (
      <div className="card fade">
        <h3 className="card-title flex items-center gap-2">
          Cluster Risk Timeline
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No cluster data yet.</p>
      </div>
    );
  }

  const data = clusterHistory.map((d) => ({
    timestamp: d.timestamp,
    value: d.cluster_risk ?? 0,
  }));

  return (
    <div className="card fade">
      <h3 className="card-title flex items-center gap-2">
        Cluster Risk Timeline
        <VirtualBadge isVirtual={isVirtual} />
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="clusterRiskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f44336" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f44336" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="timestamp" />
          <YAxis />

          {isVirtual && (
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#clusterRiskGradient)"
              stroke="none"
            />
          )}

          <Line
            type="monotone"
            dataKey="value"
            stroke={isVirtual ? "#ff9800" : "#f44336"}
            strokeWidth={2}
            dot={false}
          />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}