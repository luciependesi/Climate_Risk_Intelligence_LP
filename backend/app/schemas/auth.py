from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    name: str
    email: EmailStr
    role: str