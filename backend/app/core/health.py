def compute_device_health(reading):
    """
    Compute a simple device health score based on available fields.
    Replace this with your real logic later.
    """
    score = 1.0

    # Battery health
    if reading.battery_v is not None:
        if reading.battery_v < 3.3:
            score -= 0.4
        elif reading.battery_v < 3.6:
            score -= 0.2

    # Connectivity health
    if reading.rssi is not None:
        if reading.rssi < -110:
            score -= 0.4
        elif reading.rssi < -90:
            score -= 0.2

    # Clamp between 0 and 1
    return max(0.0, min(1.0, score))