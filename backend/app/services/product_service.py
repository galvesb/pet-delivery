from typing import List, Optional

from fastapi import HTTPException

from app.db.repositories.category_repo import CategoryRepository
from app.db.repositories.product_repo import ProductRepository
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductListResponse, ProductResponse, ProductUpdate

product_repo = ProductRepository()
category_repo = CategoryRepository()


def _to_response(p: Product) -> ProductResponse:
    cover_idx = p.cover_index if p.cover_index < len(p.image_urls) else 0
    cover_url = p.image_urls[cover_idx] if p.image_urls else ""
    return ProductResponse(
        id=str(p.id),
        name=p.name,
        description=p.description,
        price=p.price,
        image_urls=p.image_urls,
        cover_index=cover_idx,
        cover_url=cover_url,
        categories=p.categories,
        is_active=p.is_active,
        is_featured=p.is_featured,
        stock=p.stock,
    )


async def _validate_categories(slugs: List[str]) -> None:
    for slug in slugs:
        cat = await category_repo.find_by_slug(slug)
        if not cat:
            raise HTTPException(
                status_code=422,
                detail=f"Categoria '{slug}' não encontrada",
            )


async def list_products(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[ProductResponse]:
    products = await product_repo.find_by_category(category, skip, limit)
    return [_to_response(p) for p in products]


async def search_products(
    search: Optional[str] = None,
    categories: Optional[List[str]] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "newest",
    skip: int = 0,
    limit: int = 20,
    featured: Optional[bool] = None,
) -> ProductListResponse:
    products, total = await product_repo.search_products(
        search=search,
        categories=categories,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        skip=skip,
        limit=limit,
        featured=featured,
    )
    return ProductListResponse(
        items=[_to_response(p) for p in products],
        total=total,
    )


async def get_product(id: str) -> ProductResponse:
    p = await product_repo.find_by_id(id)
    if not p or not p.is_active:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return _to_response(p)


async def create_product(data: ProductCreate) -> ProductResponse:
    await _validate_categories(data.categories)
    product = Product(
        name=data.name,
        description=data.description,
        price=data.price,
        image_urls=data.image_urls,
        cover_index=data.cover_index,
        categories=data.categories,
        is_featured=data.is_featured,
    )
    product = await product_repo.create(product)
    return _to_response(product)


async def update_product(id: str, data: ProductUpdate) -> ProductResponse:
    product = await product_repo.find_by_id(id)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    update_data = data.model_dump(exclude_none=True)
    if "categories" in update_data:
        await _validate_categories(update_data["categories"])

    product = await product_repo.update(product, update_data)
    return _to_response(product)


async def delete_product(id: str) -> None:
    product = await product_repo.find_by_id(id)
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    await product_repo.delete(product)
