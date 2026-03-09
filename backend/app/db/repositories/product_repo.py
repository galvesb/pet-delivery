from typing import List, Optional

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

    async def find_by_category_slug_in_use(self, slug: str) -> List[Product]:
        """Retorna produtos que usam o slug informado."""
        return await Product.find(
            In(Product.categories, [slug]),
            Product.is_active == True,  # noqa: E712
        ).to_list()
