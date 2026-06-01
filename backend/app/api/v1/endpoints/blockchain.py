from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.repositories.blockchain import blockchain_repository
from app.models.user import User

router = APIRouter()

@router.get("/")
def get_full_blockchain(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve the complete blockchain including all blocks and standard headers.
    """
    blockchain = blockchain_repository.load_chain(db)
    return {
        "chain_length": len(blockchain.chain),
        "difficulty": blockchain.difficulty,
        "chain": [block.to_dict() for block in blockchain.chain],
        "pending_pool": [tx.to_dict() for tx in blockchain.pending_transactions]
    }

@router.get("/blocks")
def get_blocks_list(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get a simple listing of blocks and their timestamps, nonce, and hash details.
    """
    blockchain = blockchain_repository.load_chain(db)
    return [
        {
            "index": b.index,
            "timestamp": b.timestamp.isoformat() if hasattr(b.timestamp, "isoformat") else str(b.timestamp),
            "hash": b.hash,
            "previous_hash": b.previous_hash,
            "nonce": b.nonce,
            "merkle_root": b.merkle_root,
            "transaction_count": len(b.transactions)
        } for b in blockchain.chain
    ]

@router.get("/block/{hash}")
def get_block_by_hash(
    *,
    db: Session = Depends(deps.get_db),
    hash: str,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get the detailed transactions and header of a block matching a specific SHA-256 hash.
    """
    blockchain = blockchain_repository.load_chain(db)
    for b in blockchain.chain:
        if b.hash == hash:
            return b.to_dict()
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Block not found."
    )

@router.get("/transaction/{hash}")
def get_transaction_by_hash(
    *,
    db: Session = Depends(deps.get_db),
    hash: str,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Locates a specific transaction hash in the block sequence or in the pending pool.
    """
    blockchain = blockchain_repository.load_chain(db)
    
    # 1. Search block chain
    for b in blockchain.chain:
        for tx in b.transactions:
            if tx.calculate_hash() == hash:
                return {
                    "in_chain": True,
                    "block_index": b.index,
                    "block_hash": b.hash,
                    "transaction": tx.to_dict(),
                    "transaction_hash": hash
                }
                
    # 2. Search pending transactions
    for tx in blockchain.pending_transactions:
        if tx.calculate_hash() == hash:
            return {
                "in_chain": False,
                "block_index": None,
                "block_hash": None,
                "transaction": tx.to_dict(),
                "transaction_hash": hash
            }
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Transaction not found."
    )

@router.get("/validate")
def validate_blockchain(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Runs cryptographic checks on previous block hash links, proof-of-work values,
    and Merkle root hashes across the entire blockchain.
    """
    blockchain = blockchain_repository.load_chain(db)
    is_valid = blockchain.validate_chain()
    return {
        "status": "valid" if is_valid else "corrupted",
        "is_valid": is_valid,
        "chain_length": len(blockchain.chain)
    }
