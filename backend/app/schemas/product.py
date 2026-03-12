from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class SortBy(str, Enum):
    NEWEST = "newest"
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"
    NAME_ASC = "name_asc"


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=2000)
    price: float = Field(gt=0)
    image_urls: List[str] = Field(min_length=1, max_length=5)
    cover_index: int = Field(default=0, ge=0)
    categories: List[str] = Field(min_length=1)
    is_featured: bool = False
    stock: int = Field(default=0, ge=0)

    @field_validator("cover_index")
    @classmethod
    def cover_index_in_range(cls, v: int, info) -> int:
        urls = info.data.get("image_urls", [])
        if urls and v >= len(urls):
            raise ValueError(f"cover_index {v} fora do intervalo (0-{len(urls)-1})")
        return v

    @field_validator("categories")
    @classmethod
    def categories_not_empty(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("Produto deve ter pelo menos uma categoria")
        return [slug.strip().lower() for slug in v]


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    image_urls: Optional[List[str]] = Field(None, max_length=5)
    cover_index: Optional[int] = Field(None, ge=0)
    categories: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    stock: Optional[int] = Field(None, ge=0)

    @field_validator("categories")
    @classmethod
    def categories_not_empty(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if v is not None and len(v) == 0:
            raise ValueError("Produto deve ter pelo menos uma categoria")
        return [slug.strip().lower() for slug in v] if v else v


class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    image_urls: List[str]
    cover_index: int
    cover_url: str
    categories: List[str]
    is_active: bool
    is_featured: bool
    stock: int

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
