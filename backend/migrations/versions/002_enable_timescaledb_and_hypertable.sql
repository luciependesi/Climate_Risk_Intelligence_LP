CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable(
    'iot_readings',
    'ts',
    if_not_exists => TRUE
);