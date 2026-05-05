#Async SQLAlchemy + RLS + Role Injection
# backend/app/db/deps.py
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides an async SQLAlchemy session.
    Simple version without auth / RLS for now.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()