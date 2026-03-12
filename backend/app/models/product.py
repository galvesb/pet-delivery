from datetime import UTC, datetime
from typing import List, Optional

from beanie import Document
from pydantic import Field
from pymongo import ASCENDING, TEXT, IndexModel


class Product(Document):
    name: str
    description: str = ""
    price: float
    image_urls: List[str] = Field(default_factory=list)
    cover_index: int = 0
    categories: List[str] = Field(default_factory=list)  # array de slugs
    is_active: bool = True
    is_featured: bool = False
    stock: int = Field(default=0, ge=0)
    discount_price: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "products"
        indexes = [
            IndexModel([("categories", ASCENDING), ("price", ASCENDING)]),
            IndexModel([("name", TEXT), ("description", TEXT)]),
        ]
