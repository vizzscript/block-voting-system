from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from app.repositories.user import user_repository
from app.schemas.user import UserUpdate
from app.models.user import User
from app.core.security import get_password_hash

class UserService:
    def get_profile(self, db: Session, *, user_id: int) -> User:
        user = user_repository.get(db, id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )
        return user

    def update_profile(self, db: Session, *, user_id: int, user_update: UserUpdate) -> User:
        user = user_repository.get(db, id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )
            
        update_data = user_update.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["password_hash"] = get_password_hash(update_data["password"])
            del update_data["password"]
            
        return user_repository.update(db, db_obj=user, obj_in=update_data)

    def list_students(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[User]:
        return user_repository.get_users_by_role(db, role="student", skip=skip, limit=limit)

user_service = UserService()
