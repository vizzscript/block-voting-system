from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic.alias_generators import to_camel

class ElectionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: str = Field(..., min_length=1)
    position: str = Field(..., min_length=1, max_length=100)
    start_date: datetime
    end_date: datetime
    status: str = Field("Draft", max_length=30)  # 'Draft', 'Scheduled', 'Active', 'Completed', 'Cancelled'

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class ElectionCreate(ElectionBase):
    @model_validator(mode="after")
    def validate_dates(self) -> "ElectionCreate":
        if self.end_date <= self.start_date:
            raise ValueError("end date must be after start date")
        return self

class ElectionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=150)
    description: Optional[str] = Field(None, min_length=1)
    position: Optional[str] = Field(None, min_length=1, max_length=100)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=30)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

    @model_validator(mode="after")
    def validate_dates(self) -> "ElectionUpdate":
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValueError("end date must be after start date")
        return self

class ElectionResponse(ElectionBase):
    id: int

class ElectionStats(BaseModel):
    total_candidates: int
    total_voters: int  # Placeholder for future phases
    status: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )
