from typing import List, Optional

from pydantic import BaseModel, Field


class FaqCreate(BaseModel):
    question: str = Field(min_length=1, max_length=500)
    answer: str = Field(min_length=1, max_length=2000)
    is_active: bool = True


class FaqUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=1, max_length=500)
    answer: Optional[str] = Field(None, min_length=1, max_length=2000)
    is_active: Optional[bool] = None


class FaqReorderRequest(BaseModel):
    ids: List[str]


class FaqResponse(BaseModel):
    id: str
    question: str
    answer: str
    order: int
    is_active: bool

    model_config = {"from_attributes": True}
