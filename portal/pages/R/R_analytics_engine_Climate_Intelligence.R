###############################################
# Climate Risk Intelligence – Analytics - Engine
# Author: Lucie Pendesi
#
# Features:
#   - Connects to PostgreSQL
#   - Loads raw to sensor data
#   - Rolling averages (smoothing)
#   - Anomalies
#   - ARIMA forecasting (water_level_cm)
#   - cleaned data

###############################################
options(scipen = 999)  # avoid scientific notation
###############################################
# 0. Load LIBRARIES
###############################################
library(DBI)
library(RPostgres)
library(dplyr)
library(zoo)
library(forecast)
library(tidyr)

###############################################
# 1. CONNECT TO POSTGRESQL
###############################################

con <- dbConnect(
  Postgres(),
  dbname   = "climate_risk_intelligence",
  host     = "localhost",
  user     = "postgres",
  password = "Joy@2019"
)

###############################################
# 2. LOAD RAW SENSOR DATA
###############################################

df <- dbGetQuery(con, "
  SELECT device_id,
         timestamp,
         temperature_c,
         humidity_percent,
         pressure_hpa,
         air_quality_ppm,
         water_level_cm
  FROM iot_sensor_stream
  WHERE device_id = 'ESP32_001'
  ORDER BY timestamp;
")

if (nrow(df) == 0) stop('No data for ESP32_001')

###############################################
# 3. ENSURE NUMERIC TYPES
###############################################

df <- df %>%
  mutate(
    humidity_percent = as.numeric(humidity_percent),
    water_level_cm   = as.numeric(water_level_cm),
    air_quality_ppm  = as.numeric(air_quality_ppm)
  )

###############################################
# 4. ROLLING AVERAGES
###############################################

df <- df %>%
  mutate(
    water_avg_5m    = rollmean(water_level_cm,   k = 5, fill = NA),
    humidity_avg_5m = rollmean(humidity_percent, k = 5, fill = NA),
    air_avg_5m      = rollmean(air_quality_ppm,  k = 5, fill = NA)
  )

###############################################
# 5. ANOMALY DETECTION (Z-SCORE)
###############################################

z_score <- function(x) {
  if (all(is.na(x)) || sd(x, na.rm = TRUE) == 0) return(rep(0, length(x)))
  (x - mean(x, na.rm = TRUE)) / sd(x, na.rm = TRUE)
}

df <- df %>%
  mutate(
    water_z    = z_score(water_level_cm),
    humidity_z = z_score(humidity_percent),
    air_z      = z_score(air_quality_ppm),
    anomaly_flag = ifelse(
      abs(water_z)    > 3 |
        abs(humidity_z) > 3 |
        abs(air_z)      > 3,
      1, 0
    )
  )

###############################################
# 6. ARIMA FORECASTING (WATER LEVEL)
###############################################

water_ts <- df$water_level_cm[!is.na(df$water_level_cm)]

if (length(water_ts) >= 5) {
  ts_water    <- ts(water_ts, frequency = 12)
  model_arima <- auto.arima(ts_water)
  fc          <- forecast(model_arima, h = 12)
  
  forecast_df <- data.frame(
    device_id = "ESP32_001",
    horizon   = 1:12,
    forecast  = as.numeric(fc$mean),
    lower_80  = as.numeric(fc$lower[,1]),
    upper_80  = as.numeric(fc$upper[,1]),
    lower_95  = as.numeric(fc$lower[,2]),
    upper_95  = as.numeric(fc$upper[,2])
  )
  
  dbWriteTable(con, "climate_forecasts", forecast_df, append = TRUE)
}

###############################################
# 7. WRITE CLEANED DATA + LATEST ROW
###############################################

# Cleaned time series table for Python RF
dbWriteTable(con, "iot_sensor_clean", df, overwrite = TRUE)

# Latest row table for quick RF prediction
latest <- df[nrow(df), ]
dbWriteTable(con, "iot_sensor_latest", latest, overwrite = TRUE)

cat("R analytics engine completed.\n")