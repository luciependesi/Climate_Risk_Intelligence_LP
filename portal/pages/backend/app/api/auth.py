from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, User
from ..core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(req: LoginRequest):
    # TODO: real user lookup
    if req.email != "lucie@example.com":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = User(name="Lucie", email=req.email, role="Engineer")
    token = create_access_token({"sub": user.email})
    return {"user": user, "access_token": token, "token_type": "bearer"}