from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services import category_service

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories():
    return await category_service.list_categories()


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await category_service.create_category(data)


@router.put("/{id}", response_model=CategoryResponse)
async def update_category(
    id: str,
    data: CategoryUpdate,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    return await category_service.update_category(id, data)


@router.delete("/{id}")
async def delete_category(
    id: str,
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    # Deixamos o service lançar HTTPException 409 com body customizado
    await category_service.delete_category(id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
