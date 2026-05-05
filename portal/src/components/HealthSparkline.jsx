import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useLiveDeviceStream } from "../hooks/useLiveDeviceStream";

export function HealthSparkline({ deviceId }) {
  const { history } = useLiveDeviceStream(deviceId);

  const data = history.map((event) => ({
    value: event.risk.breakdown.air_quality,
  }));

  return (
    <div style={{ width: "100%", height: 40 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}