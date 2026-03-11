from typing import List, Optional, Tuple

from beanie.operators import In

from app.db.repositories.base import BaseRepository
from app.models.product import Product


class ProductRepository(BaseRepository[Product]):
    def __init__(self) -> None:
        super().__init__(Product)

    async def find_by_category(
        self,
        category_slug: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Product]:
        query = Product.find(Product.is_active == True)  # noqa: E712
        if category_slug:
            query = query.find(In(Product.categories, [category_slug]))
        return await query.sort(-Product.created_at).skip(skip).limit(limit).to_list()

    async def search_products(
        self,
        search: Optional[str] = None,
        categories: Optional[List[str]] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sort_by: str = "newest",
        skip: int = 0,
        limit: int = 20,
        featured: Optional[bool] = None,
    ) -> Tuple[List[Product], int]:
        filters: dict = {"is_active": True}

        if featured is not None:
            filters["is_featured"] = featured

        if search:
            filters["$text"] = {"$search": search}

        if categories:
            filters["categories"] = {"$in": categories}

        if min_price is not None:
            filters.setdefault("price", {})["$gte"] = min_price

        if max_price is not None:
            filters.setdefault("price", {})["$lte"] = max_price

        sort_map = {
            "newest": "-created_at",
            "price_asc": "+price",
            "price_desc": "-price",
            "name_asc": "+name",
        }
        sort_key = sort_map.get(sort_by, "-created_at")

        query = Product.find(filters)
        total = await query.count()
        products = await query.sort(sort_key).skip(skip).limit(limit).to_list()

        return products, total

    async def find_by_category_slug_in_use(self, slug: str) -> List[Product]:
        """Retorna produtos que usam o slug informado."""
        return await Product.find(
            In(Product.categories, [slug]),
            Product.is_active == True,  # noqa: E712
        ).to_list()
