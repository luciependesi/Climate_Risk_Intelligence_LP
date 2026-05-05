import React from "react";
import { LiveDeviceCard } from "./LiveDeviceCard";
import { RiskTimelineChart } from "./RiskTimelineChart";
import { DeviceMapView } from "./DeviceMapView";
import "./DeviceDetailPage.css";

interface Props {
  deviceId: string;
}

export const DeviceDetailPage: React.FC<Props> = ({ deviceId }) => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  return (
    <div className="detail-layout">
      <div className="detail-left">
        <LiveDeviceCard deviceId={deviceId} />
        <RiskTimelineChart
          deviceId={deviceId}
          startMs={oneDayAgo}
          endMs={now}
        />
      </div>

      <div className="detail-right">
        <DeviceMapView highlightDeviceId={deviceId} />
      </div>
    </div>
  );
};