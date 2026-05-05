-- Raw data: keep 180 days
SELECT add_retention_policy(
    'iot_readings',
    INTERVAL '180 days'
);

-- Hourly aggregates: keep 365 days
SELECT add_retention_policy(
    'iot_readings_hourly',
    INTERVAL '365 days'
);

-- Daily aggregates: keep 5 years
SELECT add_retention_policy(
    'iot_readings_daily',
    INTERVAL '5 years'
);