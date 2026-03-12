from datetime import UTC, datetime
from enum import Enum
from typing import List

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"


class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    quantity: int = Field(ge=1)
    stock: int = 0


class User(Document):
    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    hashed_password: str
    full_name: str
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True
    cart: List[CartItem] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "users"
        indexes = ["email"]
