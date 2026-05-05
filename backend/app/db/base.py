# Import all models here so Alembic + SQLAlchemy see them
from app.db.base_class import Base

# Import ALL SQLAlchemy models so they register with metadata
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.models.model_version import ModelVersion