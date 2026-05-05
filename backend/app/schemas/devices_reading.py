# backend/app/schemas/devices_reading.py
# backend/app/schemas/devices_reading.py
from pydantic import BaseModel, Field, confloat, conint

class DeviceReadingIn(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=128)
    timestamp_ms: conint(ge=0)
    temperature_c: confloat(ge=-50, le=80)
    humidity_pct: confloat(ge=0, le=100)
    pressure_hpa: confloat(ge=800, le=1200)
    mq135_ppm: confloat(ge=0, le=5000)
    water_level: confloat(ge=0, le=1)
    rain_intensity: confloat(ge=0, le=1)
    battery_v: confloat(ge=2.5, le=5.5)
    latitude: confloat(ge=-90, le=90)
    longitude: confloat(ge=-180, le=180)
    is_virtual: bool = False