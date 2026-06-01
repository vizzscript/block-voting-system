from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi import HTTPException, status

from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.config import settings
from app.repositories.user import user_repository
from app.schemas.user import UserRegister, UserLogin, Token
from app.models.user import User
from app.services.crypto import generate_key_pair, encrypt_private_key

class AuthService:
    def register(self, db: Session, *, user_in: UserRegister) -> User:
        # Check student_id uniqueness (since studentId is only for students)
        if user_in.student_id:
            existing_student = user_repository.get_by_student_id(db, student_id=user_in.student_id)
            if existing_student:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A student with this Student ID is already registered."
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student ID is required for registration."
            )
        
        # Check email uniqueness
        existing_email = user_repository.get_by_email(db, email=user_in.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this Email address is already registered."
            )
            
        # Generate RSA-2048 key pair for cryptographic vote signing
        private_pem, public_pem = generate_key_pair()
        encrypted_pem = encrypt_private_key(private_pem, user_in.password)

        # Create student user
        user_data = user_in.model_dump(exclude={"confirm_password", "password"})
        user_data["password_hash"] = get_password_hash(user_in.password)
        user_data["role"] = "student"
        user_data["is_active"] = True
        user_data["rsa_public_key"] = public_pem
        user_data["encrypted_rsa_private_key"] = encrypted_pem
        
        return user_repository.create(db, obj_in=user_data)

    def login(self, db: Session, *, login_in: UserLogin) -> Token:
        user = user_repository.get_by_email(db, email=login_in.email)
        if not user or not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This user account has been deactivated."
            )
            
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        return Token(access_token=access_token, refresh_token=refresh_token)

    def refresh_token(self, db: Session, *, refresh_token: str) -> Token:
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            token_type = payload.get("type")
            if not user_id or token_type != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type.",
                )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired or invalid.",
            )
            
        user = user_repository.get(db, id=int(user_id))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or deactivated.",
            )
            
        access_token = create_access_token(subject=user.id)
        new_refresh_token = create_refresh_token(subject=user.id)
        return Token(access_token=access_token, refresh_token=new_refresh_token)

auth_service = AuthService()
