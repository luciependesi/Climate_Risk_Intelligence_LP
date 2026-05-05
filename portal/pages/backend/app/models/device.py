#Models + schemas + migration+ schemas for location
# app/models/device.py
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Device(Base):
    __tablename__ = "devices"

    # Matches Docker DB schema exactly
    device_id = Column(String, primary_key=True)
    api_key = Column(String)
    is_active = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    last_seen = Column(DateTime(timezone=True))
    registered_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    name = Column(String)
    firmware_ver = Column(String)
    location_hint = Column(String)
    is_virtual = Column(Boolean, default=False)

    # You added this — safe to keep
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationship to SensorReading
    readings = relationship("SensorReading", back_populates="device")