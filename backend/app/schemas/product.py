from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl, field_validator


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=500)
    price: float = Field(gt=0)
    image_url: str
    categories: List[str] = Field(min_length=1)

    @field_validator("image_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        # Validação simples de URL
        if not v.startswith(("http://", "https://")):
            raise ValueError("image_url deve ser uma URL válida (http/https)")
        return v

    @field_validator("categories")
    @classmethod
    def categories_not_empty(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("Produto deve ter pelo menos uma categoria")
        return [slug.strip().lower() for slug in v]


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    categories: Optional[List[str]] = None
    is_active: Optional[bool] = None

    @field_validator("image_url")
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v and not v.startswith(("http://", "https://")):
            raise ValueError("image_url deve ser uma URL válida (http/https)")
        return v

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
    image_url: str
    categories: List[str]
    is_active: bool

    model_config = {"from_attributes": True}
