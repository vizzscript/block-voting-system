from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from app.repositories.election import election_repository
from app.repositories.candidate import candidate_repository
from app.repositories.user import user_repository
from app.schemas.election import ElectionCreate, ElectionUpdate, ElectionStats
from app.models.election import Election

class ElectionService:
    def create_election(self, db: Session, *, election_in: ElectionCreate) -> Election:
        return election_repository.create(db, obj_in=election_in)

    def get_election(self, db: Session, *, id: int) -> Election:
        election = election_repository.get(db, id=id)
        if not election:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Election not found."
            )
        return election

    def update_election(self, db: Session, *, id: int, election_in: ElectionUpdate) -> Election:
        election = self.get_election(db, id=id)
        return election_repository.update(db, db_obj=election, obj_in=election_in)

    def delete_election(self, db: Session, *, id: int) -> Election:
        election = self.get_election(db, id=id)
        return election_repository.remove(db, id=id)

    def activate_election(self, db: Session, *, id: int) -> Election:
        election = self.get_election(db, id=id)
        if election.status not in ["Draft", "Scheduled"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot activate election that is in '{election.status}' state."
            )
        return election_repository.update(db, db_obj=election, obj_in={"status": "Active"})

    def close_election(self, db: Session, *, id: int) -> Election:
        election = self.get_election(db, id=id)
        if election.status != "Active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot close an election that is in '{election.status}' state. It must be Active."
            )
        return election_repository.update(db, db_obj=election, obj_in={"status": "Completed"})

    def get_statistics(self, db: Session, *, id: int) -> ElectionStats:
        election = self.get_election(db, id=id)
        
        # Count candidates registered under this position
        candidates = candidate_repository.search_and_filter(db, position=election.position, limit=1000)
        total_candidates = len(candidates)
        
        # Count potential student voters (all active student users)
        students = user_repository.get_users_by_role(db, role="student", limit=1000)
        total_voters = len(students)
        
        return ElectionStats(
            total_candidates=total_candidates,
            total_voters=total_voters,
            status=election.status
        )

    def list_elections(self, db: Session, *, is_student: bool, skip: int = 0, limit: int = 100) -> List[Election]:
        if is_student:
            return election_repository.get_visible_to_students(db, skip=skip, limit=limit)
        return election_repository.get_multi(db, skip=skip, limit=limit)

election_service = ElectionService()
