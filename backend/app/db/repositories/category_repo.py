from typing import List, Optional

from app.db.repositories.base import BaseRepository
from app.models.category import Category


class CategoryRepository(BaseRepository[Category]):
    def __init__(self) -> None:
        super().__init__(Category)

    async def find_by_slug(self, slug: str) -> Optional[Category]:
        return await Category.find_one(Category.slug == slug)

    async def find_all_sorted(self) -> List[Category]:
        return await Category.find_all().sort(+Category.name).to_list()
