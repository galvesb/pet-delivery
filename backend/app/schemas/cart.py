from typing import List, Optional

from pydantic import BaseModel, Field


class CartItemSchema(BaseModel):
    product_id: str
    name: str
    price: float = Field(gt=0)
    original_price: Optional[float] = None
    image_url: str
    quantity: int = Field(ge=1)
    stock: int = 0


class CartSyncRequest(BaseModel):
    items: List[CartItemSchema]


class CartResponse(BaseModel):
    items: List[CartItemSchema]
    total: float

    @classmethod
    def from_items(cls, items: List[CartItemSchema]) -> "CartResponse":
        total = sum(item.price * item.quantity for item in items)
        return cls(items=items, total=round(total, 2))
