from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.services.election import election_service
from app.schemas.election import ElectionCreate, ElectionUpdate, ElectionResponse, ElectionStats
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=ElectionResponse, status_code=status.HTTP_201_CREATED)
def create_election(
    *,
    db: Session = Depends(deps.get_db),
    election_in: ElectionCreate,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Create a new college election (restricted to administrators).
    """
    return election_service.create_election(db, election_in=election_in)

@router.get("/", response_model=List[ElectionResponse])
def read_elections(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get election listing. Students see only non-draft (Scheduled, Active, Completed, Cancelled) items. Admin sees everything.
    """
    is_student = current_user.role == "student"
    return election_service.list_elections(db, is_student=is_student, skip=skip, limit=limit)

@router.get("/{id}", response_model=ElectionResponse)
def read_election(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get detailed information about an election by database ID.
    """
    election = election_service.get_election(db, id=id)
    if current_user.role == "student" and election.status == "Draft":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have privileges to view Draft elections."
        )
    return election

@router.put("/{id}", response_model=ElectionResponse)
def update_election(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    election_in: ElectionUpdate,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Update details of an existing election (restricted to administrators).
    """
    return election_service.update_election(db, id=id, election_in=election_in)

@router.delete("/{id}", response_model=ElectionResponse)
def delete_election(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Delete an election registration (restricted to administrators).
    """
    return election_service.delete_election(db, id=id)

@router.patch("/{id}/activate", response_model=ElectionResponse)
def activate_election(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Set an election status to 'Active' (restricted to administrators).
    """
    return election_service.activate_election(db, id=id)

@router.patch("/{id}/close", response_model=ElectionResponse)
def close_election(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Set an active election's status to 'Completed' (restricted to administrators).
    """
    return election_service.close_election(db, id=id)

@router.get("/{id}/stats", response_model=ElectionStats)
def get_election_statistics(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Retrieve statistics (e.g. candidate count, total eligible student voters) for an election (restricted to administrators).
    """
    return election_service.get_statistics(db, id=id)
