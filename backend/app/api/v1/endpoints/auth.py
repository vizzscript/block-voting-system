from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.services.auth import auth_service
from app.schemas.user import UserRegister, UserLogin, Token, RefreshTokenInput, UserResponse
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_student(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserRegister
):
    """
    Register a new student voter.
    """
    return auth_service.register(db, user_in=user_in)

@router.post("/login", response_model=Token)
def login(
    *,
    db: Session = Depends(deps.get_db),
    login_in: UserLogin
):
    """
    Standard JSON login for web application.
    """
    return auth_service.login(db, login_in=login_in)

@router.post("/login-form", response_model=Token)
def login_form(
    *,
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible form login, allowing visual test logins directly from Swagger docs.
    """
    login_schema = UserLogin(email=form_data.username, password=form_data.password)
    return auth_service.login(db, login_in=login_schema)

@router.post("/refresh", response_model=Token)
def refresh_token(
    *,
    db: Session = Depends(deps.get_db),
    refresh_input: RefreshTokenInput
):
    """
    Refresh JWT access tokens with a rolling refresh token.
    """
    return auth_service.refresh_token(db, refresh_token=refresh_input.refresh_token)
