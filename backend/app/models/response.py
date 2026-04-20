from pydantic import BaseModel
from typing import List

class AnalysisResponse(BaseModel):
    match_score: float
    missing_keywords: List[str]
    recommendations: List[str]
