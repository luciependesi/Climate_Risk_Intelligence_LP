# app/db/session.py
# Async SQLAlchemy session management for FastAPI + TimescaleDB
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings  # your DATABASE_URL lives here

engine = create_async_engine(
    settings.database_url,   # <-- correct property
    future=True,
    echo=False,
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session