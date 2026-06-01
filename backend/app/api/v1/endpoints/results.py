from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.services.results import results_service
from app.models.user import User

router = APIRouter()

@router.get("/{electionId}")
def get_election_results_summary(
    *,
    db: Session = Depends(deps.get_db),
    electionId: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get the complete results summary dashboard data for a specific election (tallies + turnout stats + winner).
    """
    tally = results_service.tally_votes(db, election_id=electionId)
    stats = results_service.get_election_statistics(db, election_id=electionId)
    winner = results_service.get_election_winner(db, election_id=electionId)
    
    return {
        "election_id": electionId,
        "results": tally["candidate_wise"],
        "statistics": stats,
        "winner_summary": winner
    }

@router.get("/{electionId}/winner")
def get_election_winner(
    *,
    db: Session = Depends(deps.get_db),
    electionId: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Tally votes and return the winning candidate of an election.
    """
    return results_service.get_election_winner(db, election_id=electionId)

@router.get("/{electionId}/statistics")
def get_election_statistics(
    *,
    db: Session = Depends(deps.get_db),
    electionId: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve turnout and registration statistics for an election.
    """
    return results_service.get_election_statistics(db, election_id=electionId)

@router.get("/{electionId}/candidate-wise")
def get_candidate_wise_breakdown(
    *,
    db: Session = Depends(deps.get_db),
    electionId: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve candidate nominee counts directly from the blockchain blocks.
    """
    tally = results_service.tally_votes(db, election_id=electionId)
    return tally["candidate_wise"]

@router.get("/verify-vote/{receiptId}")
def verify_receipt_direct(
    *,
    db: Session = Depends(deps.get_db),
    receiptId: str,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Verify standard Vote Receipt ID on the block sequence directly.
    """
    return results_service.verify_vote_receipt(db, receipt_id=receiptId)
