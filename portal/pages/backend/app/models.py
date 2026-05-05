#database models for the device and sensor readings
# backend/app/models.py
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Float,
    Boolean,
    BigInteger,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .database import Base  # your declarative base


class Device(Base):
    __tablename__ = "devices"

    id: Mapped[str] = mapped_column(String(128), primary_key=True, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    api_key: Mapped[str] = mapped_column(String(255), nullable=False)
    is_virtual: Mapped[bool] = mapped_column(Boolean, default=False)
    last_seen_ms: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    readings: Mapped[list["SensorReading"]] = relationship(
        "SensorReading", back_populates="device", cascade="all, delete-orphan"
    )


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    device_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("devices.id", ondelete="CASCADE"), index=True
    )

    timestamp_ms: Mapped[int] = mapped_column(BigInteger, index=True)

    temperature_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    humidity_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    pressure_hpa: Mapped[float | None] = mapped_column(Float, nullable=True)
    mq135_ppm: Mapped[float | None] = mapped_column(Float, nullable=True)
    water_level: Mapped[float | None] = mapped_column(Float, nullable=True)
    rain_intensity: Mapped[float | None] = mapped_column(Float, nullable=True)
    battery_v: Mapped[float | None] = mapped_column(Float, nullable=True)

    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    is_virtual: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, index=True
    )

    device: Mapped["Device"] = relationship("Device", back_populates="readings")