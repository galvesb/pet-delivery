from typing import List

from fastapi import APIRouter, Depends, status

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.banner import BannerCreate, BannerResponse, BannerUpdate
from app.services import banner_service

router = APIRouter(prefix="/banners", tags=["banners"])


@router.get("", response_model=List[BannerResponse])
async def list_active_banners():
    return await banner_service.list_active()


@router.get("/all", response_model=List[BannerResponse])
async def list_all_banners(_: User = Depends(require_role(UserRole.ADMIN))):
    return await banner_service.list_all()


@router.get("/{id}", response_model=BannerResponse)
async def get_banner(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await banner_service.get_banner(id)


@router.post("", response_model=BannerResponse, status_code=status.HTTP_201_CREATED)
async def create_banner(
    data: BannerCreate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await banner_service.create_banner(data)


@router.put("/{id}", response_model=BannerResponse)
async def update_banner(
    id: str,
    data: BannerUpdate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await banner_service.update_banner(id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_banner(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    await banner_service.delete_banner(id)
