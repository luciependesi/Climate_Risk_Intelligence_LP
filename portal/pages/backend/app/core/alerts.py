def generate_alerts(reading, risk_score, subscriber):
    alerts = []

    if risk_score >= subscriber.high_risk_threshold:
        alerts.append("High risk detected")

    if reading.air_quality_raw and reading.air_quality_raw > subscriber.aqi_threshold:
        alerts.append("Air quality deteriorating")

    if reading.rain_level_raw and reading.rain_level_raw > subscriber.rain_threshold:
        alerts.append("Heavy rainfall detected")

    if reading.battery_mv and reading.battery_mv < subscriber.battery_threshold:
        alerts.append("Device battery low")

    return alerts