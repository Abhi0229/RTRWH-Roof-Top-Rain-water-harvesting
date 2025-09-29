from pydantic import BaseModel
from typing import Optional

class AssessmentInput(BaseModel):
    roof_area: float
    dwellers: Optional[int] = None
    open_space: Optional[float] = None
    roof_type: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class AssessmentResult(BaseModel):
    captured_volume: float
    structure_type: str
    dimensions: str
    cost: float
    annual_rainfall: float