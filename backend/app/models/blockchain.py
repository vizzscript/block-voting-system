from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.base_class import Base

class BlockchainBlock(Base):
    __tablename__ = "blockchain_blocks"

    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, unique=True, index=True, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    previous_hash = Column(String(64), nullable=False)
    nonce = Column(Integer, nullable=False)
    merkle_root = Column(String(64), nullable=False)
    hash = Column(String(64), unique=True, index=True, nullable=False)

    transactions = relationship("BlockchainTransaction", back_populates="block", cascade="all, delete-orphan")

class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), unique=True, index=True, nullable=False)
    election_id = Column(Integer, index=True, nullable=False)
    candidate_id = Column(Integer, index=True, nullable=False)
    voter_hash = Column(String(64), index=True, nullable=False)
    signature = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    block_id = Column(Integer, ForeignKey("blockchain_blocks.id"), nullable=True)

    block = relationship("BlockchainBlock", back_populates="transactions")

class VoteReceipt(Base):
    __tablename__ = "vote_receipts"

    id = Column(Integer, primary_key=True, index=True)
    receipt_id = Column(String(50), unique=True, index=True, nullable=False)
    student_id = Column(String(50), index=True, nullable=False)
    election_id = Column(Integer, index=True, nullable=False)
    transaction_hash = Column(String(64), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)

    __table_args__ = (
        UniqueConstraint('student_id', 'election_id', name='_student_election_uc'),
    )
