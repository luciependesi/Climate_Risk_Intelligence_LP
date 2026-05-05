// this component fetches the risk history for a given devices and renders a simple line chart of the risk scores over time.
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useDeviceContext } from "../context/DeviceContext";
import { useWebSocket } from "../context/WebSocketContext";   // ✔ correct hook
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import ChartContainer from "./ChartContainer";
import { createBatcher } from "../utils/batch";

export default function DeviceHealthTimeline({ deviceId: propDeviceId }) {
  const { selectedDeviceId, isVirtual } = useDeviceContext();
  const deviceId = propDeviceId || selectedDeviceId;

  const { subscribe } = useWebSocket();   // ✔ FIXED
  const [history, setHistory] = useState([]);

  if (!deviceId) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "260px" }}
      >
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Health Timeline
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">Waiting for device…</p>
      </div>
    );
  }

  useEffect(() => {
    if (!deviceId || !subscribe) return;

    const batch = createBatcher(300, (items) => {
      setHistory((prev) => {
        const merged = [...items.reverse(), ...prev];
        return merged.slice(0, 100);
      });
    });

    return subscribe((msg) => {
      if (msg.type === "reading" && msg.device_id === deviceId) {
        batch({
          timestamp_ms: msg.timestamp_ms,
          risk_score: msg.risk_score ?? 0,
        });
      }
    });
  }, [deviceId, subscribe]);

  if (!history || history.length === 0) {
    return (
      <div
        className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        style={{ minHeight: "260px" }}
      >
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Health Timeline
          <VirtualBadge isVirtual={isVirtual} />
        </h3>
        <p className="text-gray-400 italic">No readings yet.</p>
      </div>
    );
  }

  const chartData = history
    .slice()
    .reverse()
    .map((h) => ({
      timestamp: new Date(h.timestamp_ms).toLocaleTimeString(),
      risk: h.risk_score,
    }));

  return (
    <div
      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade-in"
      style={{ minHeight: "260px" }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Health Timeline
          <VirtualBadge isVirtual={isVirtual} />
        </h3>

        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <ChartContainer minHeight={260}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="timestamp" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!isVirtual}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}