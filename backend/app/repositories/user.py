from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.email == email).first()

    def get_by_student_id(self, db: Session, *, student_id: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.student_id == student_id).first()

    def get_users_by_role(self, db: Session, *, role: str, skip: int = 0, limit: int = 100) -> List[User]:
        return db.query(self.model).filter(self.model.role == role).offset(skip).limit(limit).all()

user_repository = UserRepository(User)
