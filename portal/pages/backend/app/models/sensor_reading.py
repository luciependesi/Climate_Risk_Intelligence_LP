# backend/app/schemas/devices_reading.py
print(">>> SENSOR_READING MODEL LOADED <<<")

from sqlalchemy import Column, Integer, String, Float, BigInteger, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.device_id"), index=True)

    timestamp = Column(DateTime, nullable=True)
    timestamp_ms = Column(BigInteger, nullable=False)

    temperature_c = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    pressure_hpa = Column(Float, nullable=True)

    air_quality_raw = Column(Float, nullable=True)
    rain_level_raw = Column(Float, nullable=True)
    water_level_raw = Column(Float, nullable=True)

    battery_mv = Column(Float, nullable=True)

    latitude_deg = Column(Float, nullable=True)
    longitude_deg = Column(Float, nullable=True)
    altitude_m = Column(Float, nullable=True)

    hdop = Column(Float, nullable=True)
    gnss_enabled = Column(Boolean, nullable=True)
    gnss_fix_valid = Column(Boolean, nullable=True)

    rssi = Column(Integer, nullable=True)

    device = relationship("Device", back_populates="readings")