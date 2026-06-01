from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), unique=True, index=True, nullable=True)  # Admin has NULL student_id
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=True)  # Admin has NULL department
    year = Column(String(20), nullable=True)        # Admin has NULL year
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="student", nullable=False)  # 'admin' or 'student'
    is_active = Column(Boolean, default=True, nullable=False)
    rsa_public_key = Column(String, nullable=True)
    encrypted_rsa_private_key = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
