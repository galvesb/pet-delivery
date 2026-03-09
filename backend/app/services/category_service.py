from typing import List

from fastapi import HTTPException

from app.db.repositories.category_repo import CategoryRepository
from app.db.repositories.product_repo import ProductRepository
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate

category_repo = CategoryRepository()
product_repo = ProductRepository()


def _to_response(cat: Category) -> CategoryResponse:
    return CategoryResponse(id=str(cat.id), name=cat.name, slug=cat.slug)


async def list_categories() -> List[CategoryResponse]:
    cats = await category_repo.find_all_sorted()
    return [_to_response(c) for c in cats]


async def create_category(data: CategoryCreate) -> CategoryResponse:
    existing = await category_repo.find_by_slug(data.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Slug já existe")
    cat = Category(name=data.name, slug=data.slug)
    cat = await category_repo.create(cat)
    return _to_response(cat)


async def update_category(id: str, data: CategoryUpdate) -> CategoryResponse:
    cat = await category_repo.find_by_id(id)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    old_slug = cat.slug
    update_data: dict = {}

    if data.name is not None:
        update_data["name"] = data.name
    if data.slug is not None and data.slug != old_slug:
        existing = await category_repo.find_by_slug(data.slug)
        if existing:
            raise HTTPException(status_code=409, detail="Slug já existe")
        update_data["slug"] = data.slug
        # Cascade: atualiza slug em todos os produtos que usavam o slug antigo
        products_using = await product_repo.find_by_category_slug_in_use(old_slug)
        for product in products_using:
            new_categories = [
                data.slug if s == old_slug else s for s in product.categories
            ]
            await product.set({Product.categories: new_categories})

    if update_data:
        cat = await category_repo.update(cat, update_data)
    return _to_response(cat)


async def delete_category(id: str) -> None:
    cat = await category_repo.find_by_id(id)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    products_using = await product_repo.find_by_category_slug_in_use(cat.slug)
    if products_using:
        product_names = [p.name for p in products_using]
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Categoria em uso por produtos",
                "products": product_names,
            },
        )

    await category_repo.delete(cat)
