CREATE TABLE IF NOT EXISTS iot_readings (
    id              BIGSERIAL PRIMARY KEY,
    device_id       TEXT            NOT NULL,
    ts              TIMESTAMPTZ     NOT NULL,
    temperature_c   DOUBLE PRECISION NOT NULL,
    humidity_pct    DOUBLE PRECISION NOT NULL,
    pressure_hpa    DOUBLE PRECISION NOT NULL,
    mq135_ppm       DOUBLE PRECISION NOT NULL,
    water_level     DOUBLE PRECISION NOT NULL,
    rain_intensity  DOUBLE PRECISION NOT NULL,
    battery_v       DOUBLE PRECISION NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    is_virtual      BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_iot_readings_ts
    ON iot_readings (ts);

CREATE INDEX IF NOT EXISTS idx_iot_readings_device_ts
    ON iot_readings (device_id, ts);