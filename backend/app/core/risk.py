# backend/app/core/risk.py
#Risk‑score computation endpoint
from app.models.sensor_reading import SensorReading

# ---------------------------------------------------------
# Risk Score (0–1 normalized)
# ---------------------------------------------------------
def compute_risk(reading: SensorReading) -> float:
    """
    Computes a 0–1 normalized environmental risk score.
    All fields are optional-safe and normalized to comparable scales.
    """

    if not reading:
        return 0.0

    # Extract values with safe defaults
    temp = reading.temperature_c or 0
    hum = reading.humidity or 0
    aqi = reading.air_quality_raw or 0
    rain = reading.rain_level_raw or 0
    water = reading.water_level_raw or 0
    batt = reading.battery_mv or 4000  # assume mid‑range if missing

    # -----------------------------
    # Normalized sub‑scores (0–1)
    # -----------------------------

    # Temperature: 25–40°C → risk
    temp_score = max(0, min(1, (temp - 25) / 15))

    # Humidity: 50–90% → risk
    hum_score = max(0, min(1, (hum - 50) / 40))

    # Air quality: 200–500 AQI → risk
    aqi_score = max(0, min(1, (aqi - 200) / 300))

    # Rain intensity: 0–1 → risk
    rain_score = max(0, min(1, rain))

    # Water level: 0–1 → risk
    water_score = max(0, min(1, water))

    # Battery: 4200→3200 mV → risk
    batt_score = max(0, min(1, (4200 - batt) / 1000))

    # -----------------------------
    # Weighted risk model
    # -----------------------------
    base = (
        0.25 * temp_score +
        0.15 * hum_score +
        0.25 * aqi_score +
        0.10 * batt_score +
        0.10 * rain_score +
        0.10 * water_score
    )

    # GNSS penalty: enabled but no fix → slight risk bump
    if reading.gnss_enabled and not reading.gnss_fix_valid:
        base += 0.05

    # Clamp to [0, 1]
    return float(max(0, min(1, base)))


# ---------------------------------------------------------
# Confidence Score (0–100)
# ---------------------------------------------------------
def compute_confidence(reading: SensorReading) -> float:
    """
    Computes a 0–100 confidence score based on GNSS fix,
    HDOP quality, and battery health.
    """

    if not reading:
        return 0.0

    score = 100

    # GNSS fix validity
    if not reading.gnss_fix_valid:
        score -= 40

    # HDOP quality (lower = better)
    if reading.hdop is not None:
        if reading.hdop > 3:
            score -= 20
        if reading.hdop > 6:
            score -= 40

    # Battery low → less reliable
    if reading.battery_mv is not None and reading.battery_mv < 3600:
        score -= 10

    return float(max(0, min(100, score)))