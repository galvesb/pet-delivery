from typing import List

from fastapi import APIRouter, Depends, status

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.brand import BrandCreate, BrandResponse, BrandUpdate
from app.services import brand_service

router = APIRouter(prefix="/brands", tags=["brands"])


@router.get("", response_model=List[BrandResponse])
async def list_active_brands():
    return await brand_service.list_active()


@router.get("/all", response_model=List[BrandResponse])
async def list_all_brands(_: User = Depends(require_role(UserRole.ADMIN))):
    return await brand_service.list_all()


@router.get("/{id}", response_model=BrandResponse)
async def get_brand(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await brand_service.get_brand(id)


@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(
    data: BrandCreate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await brand_service.create_brand(data)


@router.put("/{id}", response_model=BrandResponse)
async def update_brand(
    id: str,
    data: BrandUpdate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await brand_service.update_brand(id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    await brand_service.delete_brand(id)
