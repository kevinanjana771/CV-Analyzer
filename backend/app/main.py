from fastapi import FastAPI
from .api.routes import router
from .core.config import init_middleware

app = FastAPI(title="CV Analyzer API")

# Init Configs
init_middleware(app)

# Include Routes
app.include_router(router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "healthy"}
