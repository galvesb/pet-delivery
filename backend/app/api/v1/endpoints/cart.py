from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.cart import CartResponse, CartSyncRequest
from app.services import cart_service

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
async def get_cart(current_user: User = Depends(get_current_user)):
    return await cart_service.get_cart(current_user)


@router.patch("", response_model=CartResponse)
async def sync_cart(
    data: CartSyncRequest,
    current_user: User = Depends(get_current_user),
):
    return await cart_service.sync_cart(current_user, data)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(current_user: User = Depends(get_current_user)):
    await cart_service.clear_cart(current_user)
