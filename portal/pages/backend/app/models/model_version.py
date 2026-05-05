#Model evolution tracking system
from sqlalchemy import Column, String, Integer, DateTime, Text, Float
from sqlalchemy.sql import func
from app.db.base_class import Base

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    version = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(Text, nullable=True)
    drift_score = Column(Float, nullable=True)
    avg_confidence = Column(Float, nullable=True)
    