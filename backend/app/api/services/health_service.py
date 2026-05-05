from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from ..models.device import DeviceReading
from ..models.schemas import DeviceHealth


async def compute_health_for_device(device_id: str, db: AsyncSession) -> dict:
    now = datetime.utcnow()
    window = now - timedelta(hours=1)

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

    if not readings:
        return DeviceHealth(
            status="offline",
            last_seen="never",
            avg_interval_sec=0.0,
            anomaly_rate=1.0,
            uptime_percent=0.0,
        ).model_dump()

    readings_sorted = sorted(readings, key=lambda r: r.timestamp)
    last = readings_sorted[-1]

    # Average interval
    if len(readings_sorted) > 1:
        deltas = [
            (b.timestamp - a.timestamp).total_seconds()
            for a, b in zip(readings_sorted[:-1], readings_sorted[1:])
        ]
        avg_interval = sum(deltas) / len(deltas)
    else:
        avg_interval = 60.0

    # Simple anomaly rate
    anomalies = 0
    for r in readings_sorted:
        if r.temperature_c >= 40 or r.temperature_c <= 0:
            anomalies += 1
        elif r.humidity >= 85 or r.humidity <= 15:
            anomalies += 1
    anomaly_rate = anomalies / len(readings_sorted)

    # Uptime
    expected_count = max(1, int(3600 / avg_interval))
    uptime_percent = min(100.0, (len(readings_sorted) / expected_count) * 100.0)

    status = "healthy"
    if uptime_percent < 70 or anomaly_rate > 0.5:
        status = "degraded"
    if uptime_percent < 30:
        status = "offline"

    return DeviceHealth(
        status=status,
        last_seen=last.timestamp.isoformat(),
        avg_interval_sec=avg_interval,
        anomaly_rate=round(anomaly_rate, 3),
        uptime_percent=round(uptime_percent, 1),
    ).model_dump()