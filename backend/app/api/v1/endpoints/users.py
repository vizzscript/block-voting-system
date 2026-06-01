from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.services.user import user_service
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import User

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
def read_profile(
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve details of the currently authenticated user's profile.
    """
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    *,
    db: Session = Depends(deps.get_db),
    user_update: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Update profile details for the currently authenticated user.
    """
    return user_service.update_profile(db, user_id=current_user.id, user_update=user_update)

@router.get("/students", response_model=List[UserResponse])
def list_students(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Retrieve all registered student voter profiles (restricted to administrators).
    """
    return user_service.list_students(db, skip=skip, limit=limit)
