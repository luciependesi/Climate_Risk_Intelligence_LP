// This component displays an overview of cluster risks, showing the average and maximum risk scores for each cluster, along with the devices in the cluster an the anomaly rate.
import React, { useEffect, useState } from "react";

export default function ClusterRiskOverview({ mode = "live" }) {
  const [clusters, setClusters] = useState([]);

  const base = mode === "live" ? "/api" : "/mock";

  useEffect(() => {
    async function fetchClusters() {
      try {
        const res = await fetch(`${base}/cluster_risk.json`);
        if (!res.ok) return;
        const data = await res.json();
        setClusters(data.clusters || []);
      } catch (e) {
        console.error("Failed to load cluster risk", e);
      }
    }
    fetchClusters();
  }, [mode]);

  if (!clusters.length) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Cluster Risk Overview</h3>
        <p className="text-gray-400 italic">No cluster data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Cluster Risk Overview</h3>

      <div className="space-y-4">
        {clusters.map((c) => (
          <div
            key={c.cluster_id}
            className="p-3 border rounded-lg bg-gray-50 shadow-sm"
          >
            <h4 className="font-semibold text-blue-700">{c.label}</h4>

            <p className="text-sm text-gray-700">
              Devices: {c.devices.join(", ")}
            </p>

            <p className="text-sm text-gray-700">
              Avg Risk:{" "}
              <span className="font-semibold">{c.avg_risk_score.toFixed(1)}</span>
            </p>

            <p className="text-sm text-gray-700">
              Max Risk:{" "}
              <span className="font-semibold">{c.max_risk_score.toFixed(1)}</span>
            </p>

            <p className="text-sm text-gray-700">
              Anomaly Rate:{" "}
              <span className="font-semibold">
                {(c.anomaly_rate * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}