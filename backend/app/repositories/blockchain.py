from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from datetime import datetime, timezone

from app.models.blockchain import BlockchainBlock, BlockchainTransaction, VoteReceipt
from app.services.blockchain_engine import Blockchain, Block, Transaction

class BlockchainRepository:
    def load_chain(self, db: Session, difficulty: int = 4) -> Blockchain:
        """
        Loads the entire blockchain from the database, ordered by index.
        If the database is empty, automatically generates and saves the Genesis block.
        """
        blockchain = Blockchain(difficulty=difficulty)
        
        # Load blocks from DB
        db_blocks = db.query(BlockchainBlock).order_by(BlockchainBlock.index.asc()).all()
        
        if not db_blocks:
            # Empty database: create, save, and load the Genesis block (index 0)
            genesis_block = blockchain.create_genesis_block()
            self.save_block(db, genesis_block)
            blockchain.chain = [genesis_block]
        else:
            # Reconstruct domain Block objects from DB models
            chain = []
            for db_b in db_blocks:
                txs = []
                for db_tx in db_b.transactions:
                    txs.append(
                        Transaction(
                            transaction_id=db_tx.transaction_id,
                            election_id=db_tx.election_id,
                            candidate_id=db_tx.candidate_id,
                            voter_hash=db_tx.voter_hash,
                            signature=db_tx.signature,
                            timestamp=db_tx.timestamp
                        )
                    )
                chain.append(
                    Block(
                        index=db_b.index,
                        timestamp=db_b.timestamp,
                        transactions=txs,
                        previous_hash=db_b.previous_hash,
                        nonce=db_b.nonce,
                        merkle_root=db_b.merkle_root,
                        hash=db_b.hash
                    )
                )
            blockchain.chain = chain
            
        # Load any persisted pending transactions (block_id is NULL)
        db_pending = db.query(BlockchainTransaction).filter(BlockchainTransaction.block_id.is_(None)).all()
        pending_txs = []
        for db_tx in db_pending:
            pending_txs.append(
                Transaction(
                    transaction_id=db_tx.transaction_id,
                    election_id=db_tx.election_id,
                    candidate_id=db_tx.candidate_id,
                    voter_hash=db_tx.voter_hash,
                    signature=db_tx.signature,
                    timestamp=db_tx.timestamp
                )
            )
        blockchain.pending_transactions = pending_txs
        
        return blockchain

    def save_block(self, db: Session, block: Block) -> BlockchainBlock:
        """
        Saves a domain Block entity and its child Transactions to the database.
        """
        # Create block DB model
        db_block = BlockchainBlock(
            index=block.index,
            timestamp=block.timestamp,
            previous_hash=block.previous_hash,
            nonce=block.nonce,
            merkle_root=block.merkle_root,
            hash=block.hash
        )
        db.add(db_block)
        db.flush()  # Generate DB ID
        
        # Save transactions tied to this block
        for tx in block.transactions:
            # Check if this transaction already exists as a pending transaction in DB
            existing_tx = db.query(BlockchainTransaction).filter(
                BlockchainTransaction.transaction_id == tx.transaction_id
            ).first()
            
            if existing_tx:
                # Link existing pending transaction to the new block
                existing_tx.block_id = db_block.id
            else:
                # Insert brand new transaction record
                db_tx = BlockchainTransaction(
                    transaction_id=tx.transaction_id,
                    election_id=tx.election_id,
                    candidate_id=tx.candidate_id,
                    voter_hash=tx.voter_hash,
                    signature=tx.signature,
                    timestamp=tx.timestamp,
                    block_id=db_block.id
                )
                db.add(db_tx)
                
        db.commit()
        db.refresh(db_block)
        return db_block

    def add_pending_transaction(self, db: Session, tx: Transaction) -> BlockchainTransaction:
        """
        Persists a transaction in the database as pending (block_id = NULL).
        """
        db_tx = BlockchainTransaction(
            transaction_id=tx.transaction_id,
            election_id=tx.election_id,
            candidate_id=tx.candidate_id,
            voter_hash=tx.voter_hash,
            signature=tx.signature,
            timestamp=tx.timestamp,
            block_id=None
        )
        db.add(db_tx)
        db.commit()
        db.refresh(db_tx)
        return db_tx

    def add_vote_receipt(self, db: Session, student_id: str, election_id: int, tx_hash: str, receipt_id: str) -> VoteReceipt:
        """
        Registers a vote receipt to prevent double voting.
        """
        db_receipt = VoteReceipt(
            receipt_id=receipt_id,
            student_id=student_id,
            election_id=election_id,
            transaction_hash=tx_hash,
            timestamp=datetime.now(timezone.utc).replace(tzinfo=None)
        )
        db.add(db_receipt)
        db.commit()
        db.refresh(db_receipt)
        return db_receipt

    def has_voted(self, db: Session, student_id: str, election_id: int) -> bool:
        """
        Checks if a specific student has already cast a vote in an election.
        """
        return db.query(VoteReceipt).filter(
            and_(
                VoteReceipt.student_id == student_id,
                VoteReceipt.election_id == election_id
            )
        ).first() is not None

    def get_receipt(self, db: Session, receipt_id: str) -> Optional[VoteReceipt]:
        """
        Fetches a vote receipt by its unique Receipt ID.
        """
        return db.query(VoteReceipt).filter(VoteReceipt.receipt_id == receipt_id).first()

    def get_voted_elections_by_student(self, db: Session, student_id: str) -> List[VoteReceipt]:
        """
        Retrieves all vote receipts for a specific student voter.
        """
        return db.query(VoteReceipt).filter(VoteReceipt.student_id == student_id).all()

blockchain_repository = BlockchainRepository()
