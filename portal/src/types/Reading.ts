export interface Reading {
  device_id: string;
  timestamp_ms: number;
  temperature_c: number;
  humidity_pct: number;
  pressure_hpa?: number;
}