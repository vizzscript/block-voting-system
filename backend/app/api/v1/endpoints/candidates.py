from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api import deps
from app.services.candidate import candidate_service
from app.schemas.candidate import CandidateCreate, CandidateUpdate, CandidateResponse
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(
    *,
    db: Session = Depends(deps.get_db),
    candidate_in: CandidateCreate,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Register a new candidate participating in the elections (restricted to administrators).
    """
    return candidate_service.create_candidate(db, candidate_in=candidate_in)

@router.get("/", response_model=List[CandidateResponse])
def read_candidates(
    *,
    db: Session = Depends(deps.get_db),
    search: Optional[str] = Query(None, description="Search query matching candidate name, position, or manifesto"),
    department: Optional[str] = Query(None, description="Filter candidates by academic department"),
    position: Optional[str] = Query(None, description="Filter candidates by voting position"),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve candidate listing (accessible to all authenticated users). Supports pagination, search, and department/position filters.
    """
    return candidate_service.list_candidates(
        db, search_query=search, department=department, position=position, skip=skip, limit=limit
    )

@router.get("/{id}", response_model=CandidateResponse)
def read_candidate(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get detailed profile of a candidate by their database ID (accessible to all authenticated users).
    """
    return candidate_service.get_candidate(db, id=id)

@router.put("/{id}", response_model=CandidateResponse)
def update_candidate(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    candidate_in: CandidateUpdate,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Update a candidate's registration details (restricted to administrators).
    """
    return candidate_service.update_candidate(db, id=id, candidate_in=candidate_in)

@router.delete("/{id}", response_model=CandidateResponse)
def delete_candidate(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_admin_user)
):
    """
    Delete a candidate registration (restricted to administrators).
    """
    return candidate_service.delete_candidate(db, id=id)
