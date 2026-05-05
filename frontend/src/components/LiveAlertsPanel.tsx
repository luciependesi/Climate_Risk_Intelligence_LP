import React, { useEffect, useState } from "react";
import { useDevices } from "../api/useDevices";
import { useLiveRiskStream } from "../api/useLiveRiskStream";
import "./LiveAlertsPanel.css";

export const LiveAlertsPanel = () => {
  const { devices } = useDevices();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!devices.length) return;

    const streams = devices.map((d) => {
      const { latest } = useLiveRiskStream(d.device_id);
      return { id: d.device_id, latest };
    });

    const interval = setInterval(() => {
      const newAlerts: any[] = [];

      streams.forEach((s) => {
        const r = s.latest;
        if (!r) return;

        if (r.flood_risk > 0.7)
          newAlerts.push({ device: s.id, type: "Flood", value: r.flood_risk });

        if (r.air_quality_risk > 0.7)
          newAlerts.push({ device: s.id, type: "Air Quality", value: r.air_quality_risk });

        if (r.heat_index_risk > 0.7)
          newAlerts.push({ device: s.id, type: "Heat Index", value: r.heat_index_risk });
      });

      setAlerts(newAlerts);
    }, 1000);

    return () => clearInterval(interval);
  }, [devices]);

  if (!alerts.length) return null;

  return (
    <div className="alerts-panel">
      <h3>Live Alerts</h3>
      {alerts.map((a, i) => (
        <div key={i} className="alert">
          <strong>{a.device}</strong> — {a.type} Risk ({Math.round(a.value * 100)}%)
        </div>
      ))}
    </div>
  );
};