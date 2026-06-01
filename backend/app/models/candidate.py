from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database.base_class import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String(100), nullable=False)
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    manifesto = Column(Text, nullable=False)
    profile_image = Column(Text, nullable=True)  # URL or base64
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
