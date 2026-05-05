from sqlalchemy import Column, Float, Integer, BigInteger

from app.db.base_class import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, index=True)

    temperature_c = Column(Float)
    humidity_percent = Column(Float)
    pressure_hpa = Column(Float)

    air_quality_raw = Column(Float)
    rain_level_raw = Column(Float)
    water_level_raw = Column(Float)

    battery_mv = Column(Integer)

    latitude_deg = Column(Float)
    longitude_deg = Column(Float)

    timestamp_ms = Column(BigInteger)