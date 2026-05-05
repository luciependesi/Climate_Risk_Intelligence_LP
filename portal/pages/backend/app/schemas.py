# API response schema for the ingest endpoint.
from pydantic import BaseModel

class IngestResponse(BaseModel):
    status: str
    device: str