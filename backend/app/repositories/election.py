from typing import List
from sqlalchemy.orm import Session
from app.models.election import Election
from app.repositories.base import BaseRepository

class ElectionRepository(BaseRepository[Election]):
    def get_by_status(self, db: Session, *, status: str, skip: int = 0, limit: int = 100) -> List[Election]:
        return db.query(self.model).filter(self.model.status == status).offset(skip).limit(limit).all()

    def get_visible_to_students(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Election]:
        # Students should only see elections that are Scheduled, Active, Completed, or Cancelled (never Draft)
        return db.query(self.model).filter(self.model.status != "Draft").offset(skip).limit(limit).all()

    def get_by_position(self, db: Session, *, position: str) -> List[Election]:
        return db.query(self.model).filter(self.model.position.ilike(position)).all()

election_repository = ElectionRepository(Election)
