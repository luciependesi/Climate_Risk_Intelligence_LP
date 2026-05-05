// frontend/src/components/ClusterGrid.tsx
//Shows multiple devices in a cluster with risk + health

import { ClusterRiskCard } from "./ClusterRiskCard";
import { DeviceHealthCard } from "./DeviceHealthCard";

export function ClusterGrid({
  devices,
  clusterRisk,
  clusterRiskPrev,
  loading,
}: {
  devices: {
    id: string;
    risk: number | null;
    health: number | null;
  }[];
  clusterRisk: number | null;
  clusterRiskPrev: number | null;
  loading: boolean;
}) {
  return (
    <div className="cluster-grid">
      <ClusterRiskCard
        score={clusterRisk}
        previous={clusterRiskPrev}
        loading={loading}
      />

      <div className="device-grid">
        {devices.map((d) => (
          <div key={d.id} className="device-card-wrapper">
            <div className="device-id">{d.id}</div>
            <DeviceHealthCard score={d.health} loading={loading} />
          </div>
        ))}
      </div>
    </div>
  );
}