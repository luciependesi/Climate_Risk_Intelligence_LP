# backend/api/cluster_anomaly.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.session import get_db
from .models import Reading

router = APIRouter(prefix="/api/cluster-anomalies", tags=["cluster"])

@router.get("/")
def get_cluster_anomalies(db: Session = Depends(get_db)):
  since = datetime.utcnow() - timedelta(hours=24)
  rows = (
      db.query(Reading.timestamp, Reading.risk_score)
      .filter(Reading.timestamp >= since)
      .order_by(Reading.timestamp)
      .all()
  )

  series = [{"t": ts.isoformat(), "risk": float(r or 0)} for ts, r in rows]
  if not series:
      return {"anomalies": [], "series": []}

  # simple rolling mean + std
  window = 10
  values = [p["risk"] for p in series]
  anomalies = []
  for i in range(len(values)):
      start = max(0, i - window)
      window_vals = values[start:i+1]
      mean = sum(window_vals) / len(window_vals)
      var = sum((v - mean) ** 2 for v in window_vals) / len(window_vals)
      std = var ** 0.5
      if std > 0 and abs(values[i] - mean) > 2.5 * std:
          anomalies.append(series[i])

  return {"anomalies": anomalies, "series": series}