from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.repositories.blockchain import blockchain_repository
from app.repositories.candidate import candidate_repository
from app.repositories.election import election_repository
from app.models.user import User

class ResultsService:
    def tally_votes(self, db: Session, election_id: int) -> dict:
        """
        Loads the blockchain, validates chain integrity, and counts candidate-wise
        votes directly by traversing blockchain blocks.
        """
        # Load and cryptographically validate the blockchain
        blockchain = blockchain_repository.load_chain(db)
        if not blockchain.validate_chain():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Security Threat: Cryptographic blockchain validation failed! Chain has been tampered with."
            )
            
        # Tally vote transactions
        tallies = {}
        
        # Traverse mined blocks
        for block in blockchain.chain:
            for tx in block.transactions:
                if tx.election_id == election_id:
                    candidate_id = tx.candidate_id
                    tallies[candidate_id] = tallies.get(candidate_id, 0) + 1
                    
        # Also traverse pending transactions in pool (to display live unmined votes)
        for tx in blockchain.pending_transactions:
            if tx.election_id == election_id:
                candidate_id = tx.candidate_id
                tallies[candidate_id] = tallies.get(candidate_id, 0) + 1

        # Map candidate IDs to candidate name strings
        candidate_breakdown = []
        candidates_db = candidate_repository.get_multi(db, limit=100)
        
        for c in candidates_db:
            # Only count candidates matching the election category
            election = election_repository.get(db, id=election_id)
            if election and c.position == election.position:
                votes = tallies.get(c.id, 0)
                candidate_breakdown.append({
                    "candidate_id": c.id,
                    "candidate_name": c.candidate_name,
                    "department": c.department,
                    "profile_image": c.profile_image,
                    "votes": votes
                })
                
        return {
            "election_id": election_id,
            "candidate_wise": candidate_breakdown
        }

    def get_election_winner(self, db: Session, election_id: int) -> dict:
        """
        Calculates winner details directly from blockchain calculations.
        """
        tally_result = self.tally_votes(db, election_id)
        candidates = tally_result["candidate_wise"]
        
        if not candidates:
            return {"winner": "No Candidates nominated", "total_votes": 0}
            
        winner = max(candidates, key=lambda x: x["votes"])
        
        # If there are zero votes cast
        if winner["votes"] == 0:
            return {
                "winner": "No votes cast yet",
                "total_votes": 0,
                "candidate_id": None,
                "profile_image": None
            }
            
        return {
            "winner": winner["candidate_name"],
            "total_votes": winner["votes"],
            "candidate_id": winner["candidate_id"],
            "profile_image": winner["profile_image"]
        }

    def get_election_statistics(self, db: Session, election_id: int) -> dict:
        """
        Computes election turnout statistics directly from the blockchain.
        """
        tally_result = self.tally_votes(db, election_id)
        total_votes_cast = sum(c["votes"] for c in tally_result["candidate_wise"])
        
        # Total registered students
        total_registered = db.query(User).filter(User.role == "student").count()
        
        turnout_pct = 0.0
        if total_registered > 0:
            turnout_pct = round((total_votes_cast / total_registered) * 100, 2)
            
        return {
            "election_id": election_id,
            "registered_students": total_registered,
            "votes_cast": total_votes_cast,
            "turnout_percentage": f"{turnout_pct}%"
        }

    def verify_vote_receipt(self, db: Session, receipt_id: str) -> dict:
        """
        Decrypts Receipt ID, traces transaction hash inside the mined blockchain block sequence,
        and returns independent cryptographic proof parameters.
        """
        receipt = blockchain_repository.get_receipt(db, receipt_id=receipt_id)
        if not receipt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vote receipt ID not found."
            )
            
        blockchain = blockchain_repository.load_chain(db)
        if not blockchain.validate_chain():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Security Threat: Cryptographic blockchain validation failed! Chain has been tampered with."
            )

        # 1. Search in mined block chain
        for block in blockchain.chain:
            for tx in block.transactions:
                if tx.calculate_hash() == receipt.transaction_hash:
                    return {
                        "status": "Verified",
                        "block_index": block.index,
                        "block_hash": block.hash,
                        "previous_hash": block.previous_hash,
                        "merkle_root": block.merkle_root,
                        "nonce": block.nonce,
                        "transaction_hash": receipt.transaction_hash,
                        "timestamp": receipt.timestamp.isoformat()
                    }

        # 2. Search in pending unmined transactions
        for tx in blockchain.pending_transactions:
            if tx.calculate_hash() == receipt.transaction_hash:
                return {
                    "status": "Pending (In Transaction Pool)",
                    "block_index": None,
                    "block_hash": None,
                    "previous_hash": None,
                    "merkle_root": None,
                    "nonce": None,
                    "transaction_hash": receipt.transaction_hash,
                    "timestamp": receipt.timestamp.isoformat()
                }

        # 3. If found in receipts but missing on chain (extremely rare block orphan/drop scenario)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction recorded but missing from active blockchain chain."
        )

results_service = ResultsService()
