import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator

HEX_COLOR_RE = re.compile(r"^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$")


def _validate_hex(v: str) -> str:
    if not HEX_COLOR_RE.match(v):
        raise ValueError("Deve ser uma cor hexadecimal válida (ex: #FF6B35)")
    return v


class BannerCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    subtitle: str = Field(default="", max_length=500)
    bg_color: str = Field(default="#FF6B35")
    text_color: str = Field(default="#FFFFFF")
    link_url: str = Field(default="", max_length=500)
    link_text: str = Field(default="", max_length=100)
    is_active: bool = True
    order: int = 0

    @field_validator("bg_color")
    @classmethod
    def validate_bg_color(cls, v: str) -> str:
        return _validate_hex(v)

    @field_validator("text_color")
    @classmethod
    def validate_text_color(cls, v: str) -> str:
        return _validate_hex(v)


class BannerUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=500)
    bg_color: Optional[str] = None
    text_color: Optional[str] = None
    link_url: Optional[str] = Field(None, max_length=500)
    link_text: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None
    order: Optional[int] = None

    @field_validator("bg_color")
    @classmethod
    def validate_bg_color(cls, v: Optional[str]) -> Optional[str]:
        return _validate_hex(v) if v is not None else v

    @field_validator("text_color")
    @classmethod
    def validate_text_color(cls, v: Optional[str]) -> Optional[str]:
        return _validate_hex(v) if v is not None else v


class BannerResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    bg_color: str
    text_color: str
    link_url: str
    link_text: str
    is_active: bool
    order: int

    model_config = {"from_attributes": True}
