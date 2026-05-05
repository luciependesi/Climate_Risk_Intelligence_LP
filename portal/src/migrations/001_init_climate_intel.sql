-- Devices
CREATE TABLE devices (
    device_id TEXT PRIMARY KEY,
    registered_at TIMESTAMPTZ DEFAULT now()
);

-- Raw IoT readings
CREATE TABLE device_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES devices(device_id),
    timestamp TIMESTAMPTZ NOT NULL,
    temperature_c DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    mq135_ppm DOUBLE PRECISION,
    water_level DOUBLE PRECISION,
    battery_v DOUBLE PRECISION,
    rssi INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

CREATE INDEX idx_readings_device_time
ON device_readings (device_id, timestamp DESC);

-- Risk history
CREATE TABLE risk_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES devices(device_id),
    timestamp TIMESTAMPTZ NOT NULL,
    score INTEGER NOT NULL,
    ci_lower INTEGER,
    ci_upper INTEGER,
    uncertainty DOUBLE PRECISION,
    volatility_10m DOUBLE PRECISION,
    tags TEXT[]
);

CREATE INDEX idx_risk_device_time
ON risk_history (device_id, timestamp DESC);

-- Device health
CREATE TABLE device_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES devices(device_id),
    timestamp TIMESTAMPTZ NOT NULL,
    status TEXT,
    avg_interval_sec DOUBLE PRECISION,
    anomaly_rate DOUBLE PRECISION,
    uptime_percent DOUBLE PRECISION
);

CREATE INDEX idx_health_device_time
ON device_health (device_id, timestamp DESC);

-- NOAA/EPA climate data
CREATE TABLE noaa_epa_climate_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL,
    temperature_c DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    rainfall_mm DOUBLE PRECISION,
    wind_speed_mps DOUBLE PRECISION,
    air_quality_index DOUBLE PRECISION,
    source TEXT NOT NULL
);

CREATE INDEX idx_noaa_time ON noaa_epa_climate_data (timestamp DESC);

-- ML climate risk predictions
CREATE TABLE climate_risk_prediction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES devices(device_id),
    timestamp TIMESTAMPTZ NOT NULL,
    risk_type TEXT NOT NULL,
    predicted_level TEXT NOT NULL,
    predicted_score INTEGER NOT NULL,
    model_version TEXT,
    confidence DOUBLE PRECISION,
    contributing_factors JSONB
);

CREATE INDEX idx_climate_pred_device_time
ON climate_risk_prediction (device_id, timestamp DESC);

-- Reference thresholds
CREATE TABLE climate_reference_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric TEXT NOT NULL,
    category TEXT NOT NULL,
    min_value DOUBLE PRECISION,
    max_value DOUBLE PRECISION,
    description TEXT
);

CREATE INDEX idx_reference_metric
ON climate_reference_data (metric, category);

-- Subscribers
CREATE TABLE climate_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id TEXT NOT NULL,
    device_id TEXT REFERENCES devices(device_id),
    region TEXT,
    wants_anomaly_alerts BOOLEAN DEFAULT TRUE,
    wants_forecast_alerts BOOLEAN DEFAULT TRUE,
    wants_risk_score_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscribers_device
ON climate_subscribers (device_id);