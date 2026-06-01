from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.database.session import engine
from app.database.base import Base
from app.utils.initial_data import init_db

# Automatically compile database tables on uvicorn startup
Base.metadata.create_all(bind=engine)

# Seed default system administrator user account
try:
    init_db()
except Exception as e:
    print(f"Error seeding database: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Phase 1: User Management, Candidate Management, and Election Management APIs",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Apply CORS credentials and rules
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_origin_regex="https?://(localhost|127\\.0\\.0\\.1)(:[0-9]+)?",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include main router namespace
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "phase": 1,
        "docs_url": "/docs"
    }
