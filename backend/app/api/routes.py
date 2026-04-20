from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..services.analyzer import analyze_cv
from ..models.response import AnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(file: UploadFile = File(...), job_desc: str = Form(...)):
    try:
        result = await analyze_cv(file, job_desc)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error analyzing CV: " + str(e))
