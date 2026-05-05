# Device authentication (API key)
# Security + verification layer
from fastapi import Header, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.device import Device
from app.core.config import settings
from datetime import datetime, timedelta
from jose import jwt
import hmac, hashlib

SECRET_KEY = "super-secret-key"  # replace later with env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ---------------------------------------------------------
# JWT creation (unchanged)
# ---------------------------------------------------------
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ---------------------------------------------------------
# HMAC signature verification (fixed)
# ---------------------------------------------------------
def verify_signature(body: bytes, signature: str | None) -> bool:
    """
    Compare the provided signature with the expected HMAC SHA256 signature.
    """
    if not signature:
        return False

    expected = hmac.new(
        SECRET_KEY.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


async def verify_request_signature(raw_body: bytes, signature: str | None):
    """
    Validate the signature passed explicitly from the request headers.
    """
    if not verify_signature(raw_body, signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    return True


# ---------------------------------------------------------
# Device API key authentication (unchanged)
# ---------------------------------------------------------
async def get_current_device(
    db: AsyncSession = Depends(get_db),
    api_key: str | None = Header(default=None, alias=settings.API_KEY_HEADER),
):
    if not api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing API key")

    stmt = select(Device).where(Device.api_key == api_key, Device.is_active == True)
    result = await db.execute(stmt)
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")

    return device