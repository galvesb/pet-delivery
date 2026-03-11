from typing import List

from fastapi import HTTPException

from app.db.repositories.brand_repo import BrandRepository
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandResponse, BrandUpdate

brand_repo = BrandRepository()


def _to_response(b: Brand) -> BrandResponse:
    return BrandResponse(
        id=str(b.id),
        name=b.name,
        logo_url=b.logo_url,
        is_active=b.is_active,
        order=b.order,
    )


async def list_active() -> List[BrandResponse]:
    brands = await brand_repo.find_active()
    return [_to_response(b) for b in brands]


async def list_all() -> List[BrandResponse]:
    brands = await brand_repo.find_all()
    return [_to_response(b) for b in brands]


async def get_brand(id: str) -> BrandResponse:
    b = await brand_repo.find_by_id(id)
    if not b:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return _to_response(b)


async def create_brand(data: BrandCreate) -> BrandResponse:
    brand = Brand(
        name=data.name,
        logo_url=data.logo_url,
        is_active=data.is_active,
        order=data.order,
    )
    brand = await brand_repo.create(brand)
    return _to_response(brand)


async def update_brand(id: str, data: BrandUpdate) -> BrandResponse:
    brand = await brand_repo.find_by_id(id)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    update_data = data.model_dump(exclude_none=True)
    brand = await brand_repo.update(brand, update_data)
    return _to_response(brand)


async def delete_brand(id: str) -> None:
    brand = await brand_repo.find_by_id(id)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    await brand_repo.delete(brand)
