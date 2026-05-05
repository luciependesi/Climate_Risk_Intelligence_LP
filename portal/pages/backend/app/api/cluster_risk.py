# backend/api/cluster_risk.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone, timedelta

from app.db.session import get_db
from app.models.sensor_reading import SensorReading
from app.core.clusters import CLUSTERS
from app.core.risk import compute_risk

router = APIRouter(prefix="/clusters", tags=["clusters"])

@router.get("/{cluster_id}/risk")
async def get_cluster_risk(
    cluster_id: str,
    db: AsyncSession = Depends(get_db),
):
    if cluster_id not in CLUSTERS:
        raise HTTPException(404, f"Cluster {cluster_id} not found")

    device_ids = CLUSTERS[cluster_id]

    # Look back 15 minutes
    now = datetime.now(tz=timezone.utc)
    cutoff = now - timedelta(minutes=15)

    # Convert to ms
    cutoff_ms = int(cutoff.timestamp() * 1000)

    # Latest reading per device
    stmt = (
        select(SensorReading)
        .where(
            SensorReading.device_id.in_(device_ids),
            SensorReading.timestamp_ms >= cutoff_ms,
        )
        .order_by(SensorReading.device_id, SensorReading.timestamp_ms.desc())
    )

    result = await db.execute(stmt)
    rows = result.scalars().all()

    if not rows:
        return {
            "cluster_id": cluster_id,
            "risk_score": 0.0,
            "device_count": 0,
            "timestamp_ms": int(now.timestamp() * 1000),
        }

    # Compute risk per device
    device_scores = {}
    for r in rows:
        if r.device_id not in device_scores:
            device_scores[r.device_id] = compute_risk(r)

    # Average cluster risk
    cluster_score = sum(device_scores.values()) / len(device_scores)

    return {
        "cluster_id": cluster_id,
        "risk_score": round(cluster_score, 3),
        "device_count": len(device_scores),
        "timestamp_ms": int(now.timestamp() * 1000),
    }