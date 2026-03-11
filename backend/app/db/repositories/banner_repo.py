from typing import List

from app.db.repositories.base import BaseRepository
from app.models.banner import Banner


class BannerRepository(BaseRepository[Banner]):
    def __init__(self) -> None:
        super().__init__(Banner)

    async def find_active(self) -> List[Banner]:
        return await Banner.find(Banner.is_active == True).sort("+order").to_list()  # noqa: E712
