from pydantic import BaseModel, Field

class VoteCast(BaseModel):
    election_id: int = Field(..., description="Database ID of the active election")
    candidate_id: int = Field(..., description="Database ID of the nominee being voted for")
    password: str = Field(..., description="Voter's account password to securely decrypt the signature key")

class VoteReceiptResponse(BaseModel):
    receipt_id: str
    transaction_hash: str
    timestamp: str

class StudentVoteHistoryItem(BaseModel):
    receipt_id: str
    election_id: int
    election_title: str
    transaction_hash: str
    timestamp: str
