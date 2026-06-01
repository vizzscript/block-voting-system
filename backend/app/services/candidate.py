from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.repositories.candidate import candidate_repository
from app.schemas.candidate import CandidateCreate, CandidateUpdate
from app.models.candidate import Candidate

class CandidateService:
    def create_candidate(self, db: Session, *, candidate_in: CandidateCreate) -> Candidate:
        # Check uniqueness of candidate student_id
        existing = candidate_repository.get_by_student_id(db, student_id=candidate_in.student_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Candidate with Student ID '{candidate_in.student_id}' is already registered."
            )
        return candidate_repository.create(db, obj_in=candidate_in)

    def get_candidate(self, db: Session, *, id: int) -> Candidate:
        candidate = candidate_repository.get(db, id=id)
        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found."
            )
        return candidate

    def update_candidate(self, db: Session, *, id: int, candidate_in: CandidateUpdate) -> Candidate:
        candidate = self.get_candidate(db, id=id)
        
        # Check student_id uniqueness if being updated
        if candidate_in.student_id and candidate_in.student_id != candidate.student_id:
            existing = candidate_repository.get_by_student_id(db, student_id=candidate_in.student_id)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Candidate with Student ID '{candidate_in.student_id}' is already registered."
                )
                
        return candidate_repository.update(db, db_obj=candidate, obj_in=candidate_in)

    def delete_candidate(self, db: Session, *, id: int) -> Candidate:
        candidate = self.get_candidate(db, id=id)
        return candidate_repository.remove(db, id=id)

    def list_candidates(
        self,
        db: Session,
        *,
        search_query: Optional[str] = None,
        department: Optional[str] = None,
        position: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Candidate]:
        return candidate_repository.search_and_filter(
            db,
            search_query=search_query,
            department=department,
            position=position,
            skip=skip,
            limit=limit
        )

candidate_service = CandidateService()
