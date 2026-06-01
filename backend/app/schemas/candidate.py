from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

class CandidateBase(BaseModel):
    candidate_name: str = Field(..., min_length=1, max_length=100)
    student_id: str = Field(..., min_length=1, max_length=50)
    department: str = Field(..., min_length=1, max_length=100)
    position: str = Field(..., min_length=1, max_length=100)
    manifesto: str = Field(..., min_length=1)
    profile_image: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    candidate_name: Optional[str] = Field(None, min_length=1, max_length=100)
    student_id: Optional[str] = Field(None, min_length=1, max_length=50)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    position: Optional[str] = Field(None, min_length=1, max_length=100)
    manifesto: Optional[str] = Field(None, min_length=1)
    profile_image: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class CandidateResponse(CandidateBase):
    id: int
