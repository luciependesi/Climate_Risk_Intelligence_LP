# backend/ml/cluster_forecast.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import Reading

_model: RandomForestRegressor | None = None

def train_cluster_model(db: Session):
  global _model
  since = datetime.utcnow() - timedelta(days=7)
  rows = (
      db.query(Reading.timestamp, Reading.risk_score)
      .filter(Reading.timestamp >= since)
      .order_by(Reading.timestamp)
      .all()
  )
  if not rows:
      return

  df = pd.DataFrame(
      [{"t": ts, "risk": float(r or 0)} for ts, r in rows]
  )
  df["hour"] = df["t"].dt.hour
  df["dow"] = df["t"].dt.dayofweek
  df["lag1"] = df["risk"].shift(1)
  df["lag2"] = df["risk"].shift(2)
  df = df.dropna()

  X = df[["hour", "dow", "lag1", "lag2"]]
  y = df["risk"]

  model = RandomForestRegressor(n_estimators=100, random_state=42)
  model.fit(X, y)
  _model = model

def predict_next_hour(db: Session):
  global _model
  if _model is None:
      train_cluster_model(db)
  if _model is None:
      return None

  now = datetime.utcnow()
  rows = (
      db.query(Reading.timestamp, Reading.risk_score)
      .order_by(Reading.timestamp.desc())
      .limit(3)
      .all()
  )
  if len(rows) < 3:
      return None

  latest = [{"t": ts, "risk": float(r or 0)} for ts, r in rows][::-1]
  hour = now.hour
  dow = now.weekday()
  lag1 = latest[-1]["risk"]
  lag2 = latest[-2]["risk"]

  X = [[hour, dow, lag1, lag2]]
  return float(_model.predict(X)[0])