import re

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    full_name: str = Field(min_length=2, max_length=100)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        errors = []
        if not re.search(r"[A-Z]", v):
            errors.append("pelo menos uma letra maiúscula")
        if not re.search(r"\d", v):
            errors.append("pelo menos um número")
        if not re.search(r"[!@#$%^&*]", v):
            errors.append("pelo menos um caractere especial (!@#$%^&*)")
        if errors:
            raise ValueError(f"Senha precisa ter: {', '.join(errors)}")
        return v

    @field_validator("full_name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    is_active: bool

    model_config = {"from_attributes": True}
