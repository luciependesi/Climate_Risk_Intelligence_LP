import random
from typing import List, Tuple
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from ..models.device import DeviceReading
from ..models.schemas import Risk, RiskBreakdown


# -------------------------------------------------------------------
# 1. FACTOR SCORING FUNCTIONS
# -------------------------------------------------------------------

def _score_temperature(t: float) -> float:
    if t is None:
        return 0.0
    if t < 0 or t > 45:
        return 1.0
    if t < 5 or t > 35:
        return 0.7
    if t < 10 or t > 30:
        return 0.4
    return 0.1


def _score_humidity(h: float) -> float:
    if h is None:
        return 0.0
    if h < 15 or h > 90:
        return 1.0
    if h < 25 or h > 80:
        return 0.7
    if h < 35 or h > 70:
        return 0.4
    return 0.1


def _score_air_quality(ppm: float) -> float:
    if ppm is None:
        return 0.0
    if ppm > 800:
        return 1.0
    if ppm > 600:
        return 0.7
    if ppm > 400:
        return 0.4
    return 0.1


def _score_water_level(w: float) -> float:
    if w is None:
        return 0.0
    if w > 80:
        return 1.0
    if w > 60:
        return 0.7
    if w > 40:
        return 0.4
    return 0.1


def _score_battery(v: float) -> float:
    if v is None:
        return 0.0
    if v < 3.3:
        return 1.0
    if v < 3.5:
        return 0.7
    if v < 3.7:
        return 0.4
    return 0.1


def _score_connectivity(rssi: int) -> float:
    if rssi is None:
        return 0.0
    if rssi < -90:
        return 1.0
    if rssi < -80:
        return 0.7
    if rssi < -70:
        return 0.4
    return 0.1


# -------------------------------------------------------------------
# 2. NORMALIZED SCORE (0–1)
# -------------------------------------------------------------------

def _compute_score_norm(r: DeviceReading) -> float:
    bt = _score_temperature(r.temperature_c)
    bh = _score_humidity(r.humidity)
    baq = _score_air_quality(r.mq135_ppm)
    bw = _score_water_level(r.water_level)
    bb = _score_battery(r.battery_v)
    bc = _score_connectivity(r.rssi)

    # weights sum to 1.0
    w_t, w_h, w_aq, w_w, w_b, w_c = 0.25, 0.15, 0.20, 0.15, 0.15, 0.10

    return (
        bt * w_t +
        bh * w_h +
        baq * w_aq +
        bw * w_w +
        bb * w_b +
        bc * w_c
    )


# -------------------------------------------------------------------
# 3. CONFIDENCE INTERVAL (BOOTSTRAP)
# -------------------------------------------------------------------

def _bootstrap_ci(r: DeviceReading, n: int = 100, alpha: float = 0.05) -> Tuple[int, int]:
    samples: List[float] = []

    for _ in range(n):
        clone = DeviceReading(
            temperature_c=(r.temperature_c or 0) + random.gauss(0, 0.5),
            humidity=(r.humidity or 0) + random.gauss(0, 2.0),
            mq135_ppm=(r.mq135_ppm or 0) + random.gauss(0, 20.0),
            water_level=(r.water_level or 0) + random.gauss(0, 2.0),
            battery_v=(r.battery_v or 0) + random.gauss(0, 0.02),
            rssi=(r.rssi or -80) + int(random.gauss(0, 2)),
        )
        s = _compute_score_norm(clone)
        samples.append(max(0.0, min(1.0, s)))

    samples.sort()
    lower_idx = int(alpha / 2 * len(samples))
    upper_idx = int((1 - alpha / 2) * len(samples)) - 1

    return (
        int(round(samples[lower_idx] * 100)),
        int(round(samples[upper_idx] * 100)),
    )


# -------------------------------------------------------------------
# 4. SCENARIO TAGS
# -------------------------------------------------------------------

def _scenario_tags(r: DeviceReading, breakdown: RiskBreakdown) -> List[str]:
    tags: List[str] = []

    if breakdown.temperature >= 60:
        tags.append("heat_stress")

    if breakdown.temperature >= 40 and r.temperature_c is not None and r.temperature_c < 0:
        tags.append("cold_stress")

    if breakdown.water_level >= 60:
        tags.append("flood_risk")

    if breakdown.air_quality >= 60:
        tags.append("air_quality_event")

    if breakdown.battery >= 60:
        tags.append("battery_critical")

    if breakdown.connectivity >= 60:
        tags.append("connectivity_issue")

    if not tags and max(
        breakdown.temperature,
        breakdown.humidity,
        breakdown.air_quality,
        breakdown.water_level,
    ) >= 40:
        tags.append("environmental_stress")

    return tags


# -------------------------------------------------------------------
# 5. VOLATILITY (10-MIN WINDOW)
# -------------------------------------------------------------------

async def _compute_volatility(device_id: str, db: AsyncSession) -> float:
    now = datetime.utcnow()
    window = now - timedelta(minutes=10)

    stmt = (
        select(DeviceReading)
        .where(
            DeviceReading.device_id == device_id,
            DeviceReading.timestamp >= window,
        )
        .order_by(desc(DeviceReading.timestamp))
    )

    result = await db.execute(stmt)
    readings = result.scalars().all()

    if len(readings) < 3:
        return 0.0

    scores = [_compute_score_norm(r) for r in readings]

    mean = sum(scores) / len(scores)
    var = sum((s - mean) ** 2 for s in scores) / len(scores)

    return min(1.0, var / 0.1)


# -------------------------------------------------------------------
# 6. UNCERTAINTY
# -------------------------------------------------------------------

def _compute_uncertainty(r: DeviceReading) -> float:
    missing = sum([
        r.temperature_c is None,
        r.humidity is None,
        r.mq135_ppm is None,
        r.water_level is None,
        r.battery_v is None,
        r.rssi is None,
    ])

    missing_frac = missing / 6

    extreme = 0
    if r.temperature_c is not None and (r.temperature_c < -5 or r.temperature_c > 50):
        extreme += 1
    if r.mq135_ppm is not None and r.mq135_ppm > 1200:
        extreme += 1
    if r.water_level is not None and r.water_level > 90:
        extreme += 1

    extreme_penalty = min(0.5, 0.2 * extreme)

    return min(1.0, missing_frac + extreme_penalty)


# -------------------------------------------------------------------
# 7. MAIN RISK COMPUTATION
# -------------------------------------------------------------------

async def compute_risk_for_device(device_id: str, db: AsyncSession) -> Risk:
    stmt = (
        select(DeviceReading)
        .where(DeviceReading.device_id == device_id)
        .order_by(desc(DeviceReading.timestamp))
        .limit(1)
    )

    result = await db.execute(stmt)
    r = result.scalar_one_or_none()

    if r is None:
        breakdown = RiskBreakdown(
            temperature=0, humidity=0, air_quality=0,
            water_level=0, battery=0, connectivity=0
        )
        return Risk(
            score=0,
            level="Unknown",
            model_score=0,
            breakdown=breakdown,
            uncertainty=1.0,
            volatility_10m=0.0,
            ci_lower=0,
            ci_upper=0,
            tags=["no_data"],
        )

    score_norm = _compute_score_norm(r)
    score = int(round(score_norm * 100))

    if score >= 80:
        level = "High"
    elif score >= 50:
        level = "Medium"
    elif score > 0:
        level = "Low"
    else:
        level = "Stable"

    bt = _score_temperature(r.temperature_c)
    bh = _score_humidity(r.humidity)
    baq = _score_air_quality(r.mq135_ppm)
    bw = _score_water_level(r.water_level)
    bb = _score_battery(r.battery_v)
    bc = _score_connectivity(r.rssi)

    breakdown = RiskBreakdown(
        temperature=round(bt * 100, 1),
        humidity=round(bh * 100, 1),
        air_quality=round(baq * 100, 1),
        water_level=round(bw * 100, 1),
        battery=round(bb * 100, 1),
        connectivity=round(bc * 100, 1),
    )

    uncertainty = _compute_uncertainty(r)
    volatility = await _compute_volatility(device_id, db)
    ci_lower, ci_upper = _bootstrap_ci(r)
    tags = _scenario_tags(r, breakdown)

    return Risk(
    score=score,
    level=level,
    model_score=score,
    breakdown=breakdown,
    uncertainty=round(uncertainty, 3),
    volatility_10m=round(volatility, 3),
    ci_lower=ci_lower,
    ci_upper=ci_upper,
    tags=tags,
).model_dump()
