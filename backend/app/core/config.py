import json
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "38b368be0804b9015c7a0df45f479a0b162629b3c4bb91dfa3fe1a8a25cbfcb1"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    PROJECT_NAME: str = "Secure Voting Mechanism"
    
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]

    DATABASE_URL: str = "postgresql://postgres:postgrespassword@db:5432/voting_system"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
