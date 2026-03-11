from typing import Optional

from pydantic import BaseModel, Field


class BrandCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    logo_url: str
    is_active: bool = True
    order: int = 0


class BrandUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class BrandResponse(BaseModel):
    id: str
    name: str
    logo_url: str
    is_active: bool
    order: int

    model_config = {"from_attributes": True}
