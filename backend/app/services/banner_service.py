from typing import List

from fastapi import HTTPException

from app.db.repositories.banner_repo import BannerRepository
from app.models.banner import Banner
from app.schemas.banner import BannerCreate, BannerResponse, BannerUpdate

banner_repo = BannerRepository()


def _to_response(b: Banner) -> BannerResponse:
    return BannerResponse(
        id=str(b.id),
        title=b.title,
        subtitle=b.subtitle,
        bg_color=b.bg_color,
        text_color=b.text_color,
        link_url=b.link_url,
        link_text=b.link_text,
        is_active=b.is_active,
        order=b.order,
    )


async def list_active() -> List[BannerResponse]:
    banners = await banner_repo.find_active()
    return [_to_response(b) for b in banners]


async def list_all() -> List[BannerResponse]:
    banners = await banner_repo.find_all()
    return [_to_response(b) for b in banners]


async def get_banner(id: str) -> BannerResponse:
    b = await banner_repo.find_by_id(id)
    if not b:
        raise HTTPException(status_code=404, detail="Banner não encontrado")
    return _to_response(b)


async def create_banner(data: BannerCreate) -> BannerResponse:
    banner = Banner(
        title=data.title,
        subtitle=data.subtitle,
        bg_color=data.bg_color,
        text_color=data.text_color,
        link_url=data.link_url,
        link_text=data.link_text,
        is_active=data.is_active,
        order=data.order,
    )
    banner = await banner_repo.create(banner)
    return _to_response(banner)


async def update_banner(id: str, data: BannerUpdate) -> BannerResponse:
    banner = await banner_repo.find_by_id(id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner não encontrado")
    update_data = data.model_dump(exclude_none=True)
    banner = await banner_repo.update(banner, update_data)
    return _to_response(banner)


async def delete_banner(id: str) -> None:
    banner = await banner_repo.find_by_id(id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner não encontrado")
    await banner_repo.delete(banner)
