# backend/api/cluster_forecast.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .dependencies import get_db
from ..ml.cluster_forecast import predict_next_hour

router = APIRouter(prefix="/api/cluster-forecast", tags=["cluster"])

@router.get("/")
def get_cluster_forecast(db: Session = Depends(get_db)):
  pred = predict_next_hour(db)
  return {"next_hour_risk": pred}