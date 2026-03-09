from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None, description="Filtrar por slug de categoria"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    return await product_service.list_products(category, skip, limit)


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
