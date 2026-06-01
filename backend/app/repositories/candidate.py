from typing import Optional, List
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.candidate import Candidate
from app.repositories.base import BaseRepository

class CandidateRepository(BaseRepository[Candidate]):
    def get_by_student_id(self, db: Session, *, student_id: str) -> Optional[Candidate]:
        return db.query(self.model).filter(self.model.student_id == student_id).first()

    def search_and_filter(
        self,
        db: Session,
        *,
        search_query: Optional[str] = None,
        department: Optional[str] = None,
        position: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Candidate]:
        q = db.query(self.model)
        
        if search_query:
            pattern = f"%{search_query}%"
            q = q.filter(
                or_(
                    self.model.candidate_name.ilike(pattern),
                    self.model.position.ilike(pattern),
                    self.model.manifesto.ilike(pattern)
                )
            )
            
        if department:
            q = q.filter(self.model.department.ilike(department))
            
        if position:
            q = q.filter(self.model.position.ilike(position))
            
        return q.order_by(self.model.candidate_name.asc()).offset(skip).limit(limit).all()

candidate_repository = CandidateRepository(Candidate)
