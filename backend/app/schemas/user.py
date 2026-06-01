from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from pydantic.alias_generators import to_camel

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    student_id: Optional[str] = Field(None, max_length=50)
    department: Optional[str] = Field(None, max_length=100)
    year: Optional[str] = Field(None, max_length=20)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class UserRegister(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("passwords do not match")
        return v

    @field_validator("student_id", "department", "year")
    @classmethod
    def student_fields_required(cls, v: Optional[str], info) -> Optional[str]:
        # During register, standard role is student.
        # So these fields should technically be provided unless it's handled by service layer.
        # Let's validate details in the service, but keep them optional here to support admin registrations too if needed.
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    type: Optional[str] = None

class RefreshTokenInput(BaseModel):
    refresh_token: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    year: Optional[str] = Field(None, max_length=20)
    password: Optional[str] = Field(None, min_length=8, max_length=100)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
