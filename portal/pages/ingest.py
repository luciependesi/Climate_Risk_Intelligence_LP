#ingest/sensor
from fastapi import Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sensor_pb2 import SensorReading
from app.models.sensor_reading import SensorReading as SensorReadingModel
from app.api.services.sensor_reading import store_reading
from app.db.session import get_db
from app.api.websocket_manager import ws_manager