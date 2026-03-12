from typing import List

from fastapi import APIRouter, Depends, status

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.faq import FaqCreate, FaqReorderRequest, FaqResponse, FaqUpdate
from app.services import faq_service

router = APIRouter(prefix="/faqs", tags=["faqs"])


@router.get("", response_model=List[FaqResponse])
async def list_active_faqs():
    return await faq_service.list_active()


@router.get("/all", response_model=List[FaqResponse])
async def list_all_faqs(_: User = Depends(require_role(UserRole.ADMIN))):
    return await faq_service.list_all()


@router.patch("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_faqs(
    data: FaqReorderRequest,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    await faq_service.reorder_faqs(data)


@router.get("/{id}", response_model=FaqResponse)
async def get_faq(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await faq_service.get_faq(id)


@router.post("", response_model=FaqResponse, status_code=status.HTTP_201_CREATED)
async def create_faq(
    data: FaqCreate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await faq_service.create_faq(data)


@router.patch("/{id}", response_model=FaqResponse)
async def update_faq(
    id: str,
    data: FaqUpdate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await faq_service.update_faq(id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faq(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    await faq_service.delete_faq(id)
