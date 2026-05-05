from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):
    id: int | None = None
    email: str
    name: str | None = None

class Cluster(BaseModel):
    id: int | None = None
    name: str
    description: str | None = None

# -----------------------------
# Risk Breakdown (factor-level)
# -----------------------------
class RiskBreakdown(BaseModel):
    temperature: float
    humidity: float
    air_quality: float
    water_level: float
    battery: float
    connectivity: float


# -----------------------------
# Full Risk Object
# -----------------------------
class Risk(BaseModel):
    score: int
    level: str
    model_score: int
    breakdown: RiskBreakdown

    # Advanced analytics
    uncertainty: float          # 0–1 (higher = less certain)
    volatility_10m: float       # 0–1 (higher = more unstable)
    ci_lower: int               # lower bound of CI
    ci_upper: int               # upper bound of CI
    tags: List[str]             # scenario tags (heat_stress, flood_risk, etc.)


# -----------------------------
# Device Reading (Frontend)
# -----------------------------
class DeviceReadingOut(BaseModel):
    device_id: str
    timestamp: str

    temperature_c: float
    humidity: float
    pressure_hpa: Optional[float] = None
    mq135_ppm: Optional[float] = None
    water_level: Optional[float] = None
    battery_v: Optional[float] = None
    rssi: Optional[int] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None


# -----------------------------
# WebSocket Event Payload
# -----------------------------
class LiveEvent(BaseModel):
    type: str                   # "reading"
    reading: DeviceReadingOut
    risk: Risk