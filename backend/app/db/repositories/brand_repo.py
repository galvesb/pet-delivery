from typing import List

from app.db.repositories.base import BaseRepository
from app.models.brand import Brand


class BrandRepository(BaseRepository[Brand]):
    def __init__(self) -> None:
        super().__init__(Brand)

    async def find_active(self) -> List[Brand]:
        return await Brand.find(Brand.is_active == True).sort("+order").to_list()  # noqa: E712
