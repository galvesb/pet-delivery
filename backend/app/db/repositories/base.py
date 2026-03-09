from typing import Generic, List, Optional, Type, TypeVar

from beanie import Document

T = TypeVar("T", bound=Document)


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T]) -> None:
        self.model = model

    async def find_by_id(self, id: str) -> Optional[T]:
        return await self.model.get(id)

    async def find_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        return await self.model.find_all().skip(skip).limit(limit).to_list()

    async def create(self, doc: T) -> T:
        return await doc.insert()

    async def update(self, doc: T, data: dict) -> T:
        await doc.set(data)
        return doc

    async def delete(self, doc: T) -> None:
        await doc.delete()
