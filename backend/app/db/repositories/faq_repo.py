from typing import List

from app.db.repositories.base import BaseRepository
from app.models.faq import FaqItem


class FaqRepository(BaseRepository[FaqItem]):
    def __init__(self) -> None:
        super().__init__(FaqItem)

    async def find_all_active(self) -> List[FaqItem]:
        return await FaqItem.find(FaqItem.is_active == True).sort("+order").to_list()  # noqa: E712

    async def find_all(self) -> List[FaqItem]:
        return await FaqItem.find_all().sort("+order").to_list()

    async def reorder(self, ids: List[str]) -> None:
        for index, faq_id in enumerate(ids):
            item = await self.find_by_id(faq_id)
            if item:
                await item.set({"order": index})
