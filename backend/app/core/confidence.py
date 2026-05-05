from typing import Optional, Dict, Any

def compute_confidence(reading: dict) -> float:
    """
    Placeholder confidence function.
    Returns a value between 0 and 1 based on how many fields are present.
    """
    if not reading:
        return 0.0

    keys = [
        "temperature_c",
        "humidity",
        "pressure_hpa",
        "air_quality",
        "rain_level",
        "water_level",
        "battery_voltage",
        "latitude",
        "longitude",
    ]

    present = sum(1 for k in keys if reading.get(k) is not None)
    total = len(keys)

    return present / total if total else 0.0