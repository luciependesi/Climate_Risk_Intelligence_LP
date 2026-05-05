// src/pages/ClusterOverviewPage.jsx
import ClusterOverviewLayout from "./ClusterOverviewLayout";
import { useClusterRisk } from "../hooks/useClusterRisk";

import ClusterRiskCard from "../components/ClusterRiskCard";
import ClusterRiskHeatmap from "../components/ClusterRiskHeatmap";
import ClusterRiskTimeline from "../components/ClusterRiskTimeline";
import ClusterRiskAlerts from "../components/ClusterRiskAlerts";
import ClusterRiskMapOverlay from "../components/ClusterRiskMapOverlay";
import DeviceMap from "../components/DeviceMap";

export default function ClusterOverviewPage() {
  const { data, forecast, isLoading, mode } = useClusterScenario();
  if (isLoading) return <div>Loading…</div>;

  return (
    <ClusterOverviewLayout>
      {(tab) => {
        switch (tab) {
          case "overview":
            return (
              <ClusterRiskCard
                avgRisk={data.avg_risk}
                deviceCount={data.device_count}
                trend={data.trend}
              />
            );

          case "heatmap":
            return <ClusterRiskHeatmap devices={data.per_device} />;

          case "timeline":
            return <ClusterRiskTimeline data={data.trend} />;

          case "alerts":
            return (
              <ClusterRiskAlerts
                avgRisk={data.avg_risk}
                perDevice={data.per_device}
                trend={data.trend}
              />
            );

          case "map":
            return (
              <DeviceMap overlay={<ClusterRiskMapOverlay devices={data.per_device} />} />
            );
        }
      }}
    </ClusterOverviewLayout>
  );
}