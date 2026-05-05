# backend/app/schemas/device.py
#Device registration endpoint

from pydantic import BaseModel
from typing import Optional

class DeviceCreate(BaseModel):
  id: str
  name: Optional[str] = None

class DeviceOut(BaseModel):
  id: str
  name: Optional[str] = None
  api_key: str

  class Config:
      from_attributes = True