import React from "react";
import "../styles/ClusterGrid.css";
import "../styles/LiveDeviceCard.css";

import { useLiveDevices } from "../hooks/useLiveDevices";
import LiveDeviceCard from "../components/LiveDeviceCard";
import DeviceHealthCard from "../components/DeviceHealthCard";
import { HealthSparkline } from "../components/HealthSparkline";

export default function DevicesPage() {
  const { devices } = useLiveDevices();

  return (
    <div className="cluster-grid">
      {Object.values(devices).map((event) => {
        const deviceId = event.reading.device_id;

        return (
          <div key={deviceId} className="cluster">
            <div className="cluster-header">
              <h3>{deviceId}</h3>
              <HealthSparkline deviceId={deviceId} />
            </div>

            <div className="cluster-body">
              <LiveDeviceCard deviceId={deviceId} />
              <DeviceHealthCard
                health={event.health}
                loading={!event.health}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}