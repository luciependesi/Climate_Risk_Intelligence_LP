// src/types/cluster.ts

export type ClusterRiskTrendPoint = {
  t: string;     // ISO timestamp
  risk: number;  // 0–100
};

export type ClusterRiskDevice = {
  device_id: string;
  risk: number;  // 0–100
  lat?: number;
  lng?: number;
};

export type ClusterRiskResponse = {
  avg_risk: number;
  device_count: number;
  per_device: ClusterRiskDevice[];
  trend: ClusterRiskTrendPoint[];
};

export type ClusterAnomalyPoint = {
  t: string;
  risk: number;
};

export type ClusterAnomalyResponse = {
  anomalies: ClusterAnomalyPoint[];
  series: ClusterAnomalyPoint[];
};

export type ClusterForecastResponse = {
  next_hour_risk: number | null;
};