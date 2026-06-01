import uuid
import hashlib
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone

from app.models.user import User
from app.repositories.election import election_repository
from app.repositories.candidate import candidate_repository
from app.repositories.user import user_repository
from app.repositories.blockchain import blockchain_repository
from app.services.blockchain_engine import Transaction
from app.services.crypto import decrypt_private_key, sign_data

class VotingService:
    def cast_vote(
        self,
        db: Session,
        *,
        student_user: User,
        election_id: int,
        candidate_id: int,
        plain_password: str
    ) -> dict:
        """
        Validates voter eligibility, decrypts RSA private key, signs vote transaction,
        registers a vote receipt, and triggers block mining if transaction threshold is met.
        """
        # 1. Verify election details
        election = election_repository.get(db, id=election_id)
        if not election:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Election not found."
            )
        
        # Verify election is currently active
        if election.status != "Active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This election is currently not active. Status: {election.status}"
            )
            
        # Verify time window is valid
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if now < election.start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This election has not started yet."
            )
        if now > election.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This election has already closed."
            )

        # 2. Verify candidate details
        candidate = candidate_repository.get(db, id=candidate_id)
        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate nominee not found."
            )
            
        # Verify candidate runs for the correct election position
        if candidate.position != election.position:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Candidate is not running in this election category."
            )

        # 3. Duplicate vote prevention
        if blockchain_repository.has_voted(db, student_id=student_user.student_id, election_id=election_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vote already submitted. You cannot vote twice in the same election."
            )

        # 4. Decrypt voter's private signing key using their raw password
        try:
            private_pem = decrypt_private_key(
                student_user.encrypted_rsa_private_key,
                passphrase=plain_password
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Voter password verification failed. Cryptographic signature could not be generated."
            )

        # 5. Create vote transaction data structure
        tx_id = str(uuid.uuid4())
        
        # Anonymize student identity via SHA-256 hash (never store student_id on chain!)
        voter_hash_input = f"{student_user.student_id}:{election_id}"
        voter_hash = hashlib.sha256(voter_hash_input.encode("utf-8")).hexdigest()
        
        tx_timestamp = datetime.now(timezone.utc).replace(tzinfo=None)
        
        # 6. Generate digital signature for this transaction
        # Stable string representation to sign
        tx_string = f"{tx_id}:{election_id}:{candidate_id}:{voter_hash}:{tx_timestamp.isoformat()}"
        try:
            signature = sign_data(private_pem, tx_string.encode("utf-8"))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cryptographic signing failure: {e}"
            )

        # 7. Persist pending transaction in database pool
        domain_tx = Transaction(
            transaction_id=tx_id,
            election_id=election_id,
            candidate_id=candidate_id,
            voter_hash=voter_hash,
            signature=signature,
            timestamp=tx_timestamp
        )
        blockchain_repository.add_pending_transaction(db, domain_tx)

        # 8. Register secure, user-verifiable Vote Receipt
        receipt_id = f"VOTE-{uuid.uuid4().hex[:6].upper()}"
        tx_hash = domain_tx.calculate_hash()
        db_receipt = blockchain_repository.add_vote_receipt(
            db,
            student_id=student_user.student_id,
            election_id=election_id,
            tx_hash=tx_hash,
            receipt_id=receipt_id
        )

        # 9. Load blockchain chain state and trigger Proof-of-Work mining if threshold met
        blockchain = blockchain_repository.load_chain(db)
        
        # Check if threshold (2 pending transactions) has been met
        # Note: We just added one pending transaction in DB, so we reload to check pool size
        blockchain = blockchain_repository.load_chain(db)
        if len(blockchain.pending_transactions) >= 2:
            try:
                mined_block = blockchain.mine_block()
                blockchain_repository.save_block(db, mined_block)
            except Exception as e:
                # Log mining error, but do not fail the vote since the pending transaction and receipt are already persisted
                print(f"Background block mining execution failed: {e}")

        return {
            "receipt_id": db_receipt.receipt_id,
            "transaction_hash": db_receipt.transaction_hash,
            "timestamp": db_receipt.timestamp.isoformat()
        }

    def get_student_vote_history(self, db: Session, student_id: str) -> list:
        """
        Retrieves all vote receipts for a student voter.
        """
        receipts = blockchain_repository.get_voted_elections_by_student(db, student_id=student_id)
        history = []
        for r in receipts:
            election = election_repository.get(db, id=r.election_id)
            history.append({
                "receipt_id": r.receipt_id,
                "election_id": r.election_id,
                "election_title": election.title if election else "Unknown Election",
                "transaction_hash": r.transaction_hash,
                "timestamp": r.timestamp.isoformat()
            })
        return history

voting_service = VotingService()
