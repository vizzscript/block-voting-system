from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.services.voting import voting_service
from app.services.results import results_service
from app.schemas.vote import VoteCast, VoteReceiptResponse, StudentVoteHistoryItem
from app.models.user import User

router = APIRouter()

@router.post("/cast", response_model=VoteReceiptResponse, status_code=status.HTTP_201_CREATED)
def cast_vote(
    *,
    db: Session = Depends(deps.get_db),
    vote_in: VoteCast,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Cast a vote in an active election (restricted to registered student voters).
    Requires verifying the user's password to decrypt their private signing key.
    """
    if current_user.role != "student":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only registered students are permitted to cast votes."
        )
        
    return voting_service.cast_vote(
        db,
        student_user=current_user,
        election_id=vote_in.election_id,
        candidate_id=vote_in.candidate_id,
        plain_password=vote_in.password
    )

@router.get("/history", response_model=List[StudentVoteHistoryItem])
def get_voter_history(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve history of all vote receipts cast by the authenticated student voter.
    """
    if current_user.role != "student":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students have access to personal voting receipts."
        )
        
    return voting_service.get_student_vote_history(db, student_id=current_user.student_id)

@router.get("/verify/{receiptId}")
def verify_receipt(
    *,
    db: Session = Depends(deps.get_db),
    receiptId: str,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Independent cryptographic auditor verifying a specific Receipt ID on the blockchain.
    """
    return results_service.verify_vote_receipt(db, receipt_id=receiptId)
