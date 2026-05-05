# app/api/alerts.py
from fastapi import APIRouter, Query

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/")
async def get_alerts(device_id: int = Query(...)):
    # Return empty list for now so frontend stops 404'ing
    return []