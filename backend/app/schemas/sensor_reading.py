from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SensorReadingBase(BaseModel):
    device_id: str
    timestamp: Optional[datetime] = None
    timestamp_ms: int

    temperature_c: Optional[float] = None
    humidity: Optional[float] = None
    pressure_hpa: Optional[float] = None

    air_quality_raw: Optional[float] = None
    rain_level_raw: Optional[float] = None
    water_level_raw: Optional[float] = None

    battery_mv: Optional[float] = None

    latitude_deg: Optional[float] = None
    longitude_deg: Optional[float] = None
    altitude_m: Optional[float] = None

    hdop: Optional[float] = None
    gnss_enabled: Optional[bool] = None
    gnss_fix_valid: Optional[bool] = None

    rssi: Optional[int] = None


class SensorReadingOut(SensorReadingBase):
    id: int

    class Config:
        orm_mode = True