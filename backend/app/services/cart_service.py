from typing import List

from fastapi import HTTPException

from app.db.repositories.product_repo import ProductRepository
from app.db.repositories.user_repo import UserRepository
from app.models.user import CartItem, User
from app.schemas.cart import CartItemSchema, CartResponse, CartSyncRequest

user_repo = UserRepository()
product_repo = ProductRepository()


def _cart_items_to_schema(items: List[CartItem]) -> List[CartItemSchema]:
    return [
        CartItemSchema(
            product_id=item.product_id,
            name=item.name,
            price=item.price,
            image_url=item.image_url,
            quantity=item.quantity,
            stock=item.stock,
        )
        for item in items
    ]


async def get_cart(user: User) -> CartResponse:
    items = _cart_items_to_schema(user.cart)
    return CartResponse.from_items(items)


async def sync_cart(user: User, data: CartSyncRequest) -> CartResponse:
    updated_items: list[CartItemSchema] = []
    for item in data.items:
        product = await product_repo.find_by_id(item.product_id)
        if not product or not product.is_active:
            raise HTTPException(
                status_code=422,
                detail=f"Produto '{item.product_id}' não encontrado ou inativo",
            )
        effective_price = product.discount_price if product.discount_price is not None else product.price
        original_price = product.price if product.discount_price is not None else None
        updated_items.append(
            CartItemSchema(
                product_id=item.product_id,
                name=product.name,
                price=effective_price,
                original_price=original_price,
                image_url=item.image_url,
                quantity=item.quantity,
                stock=product.stock,
            )
        )

    new_cart = [
        CartItem(
            product_id=i.product_id,
            name=i.name,
            price=i.price,
            image_url=i.image_url,
            quantity=i.quantity,
            stock=i.stock,
        )
        for i in updated_items
    ]
    await user_repo.update_cart(user, new_cart)
    return CartResponse.from_items(updated_items)


async def clear_cart(user: User) -> None:
    await user_repo.update_cart(user, [])
