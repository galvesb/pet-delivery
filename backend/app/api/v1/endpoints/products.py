from typing import Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.product import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
    SortBy,
)
from app.services import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    category: Optional[str] = Query(None, description="Filtrar por slug de categoria (retrocompatível)"),
    categories: Optional[str] = Query(None, description="Slugs separados por vírgula (multi-select)"),
    search: Optional[str] = Query(None, description="Busca textual em nome e descrição"),
    sort_by: SortBy = Query(SortBy.NEWEST, description="Ordenação"),
    min_price: Optional[float] = Query(None, ge=0, description="Preço mínimo"),
    max_price: Optional[float] = Query(None, ge=0, description="Preço máximo"),
    featured: Optional[bool] = Query(None, description="Filtrar produtos em destaque"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    cat_list: list[str] | None = None
    if categories:
        cat_list = [s.strip() for s in categories.split(",") if s.strip()]
    elif category:
        cat_list = [category]

    return await product_service.search_products(
        search=search,
        categories=cat_list,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by.value,
        skip=skip,
        limit=limit,
        featured=featured,
    )


@router.get("/{id}", response_model=ProductResponse)
async def get_product(id: str):
    return await product_service.get_product(id)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await product_service.create_product(data)


@router.put("/{id}", response_model=ProductResponse)
async def update_product(
    id: str,
    data: ProductUpdate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await product_service.update_product(id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    await product_service.delete_product(id)
