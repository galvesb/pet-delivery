from typing import List

from fastapi import HTTPException

from app.db.repositories.faq_repo import FaqRepository
from app.models.faq import FaqItem
from app.schemas.faq import FaqCreate, FaqReorderRequest, FaqResponse, FaqUpdate

faq_repo = FaqRepository()


def _to_response(f: FaqItem) -> FaqResponse:
    return FaqResponse(
        id=str(f.id),
        question=f.question,
        answer=f.answer,
        order=f.order,
        is_active=f.is_active,
    )


async def list_active() -> List[FaqResponse]:
    items = await faq_repo.find_all_active()
    return [_to_response(f) for f in items]


async def list_all() -> List[FaqResponse]:
    items = await faq_repo.find_all()
    return [_to_response(f) for f in items]


async def get_faq(id: str) -> FaqResponse:
    f = await faq_repo.find_by_id(id)
    if not f:
        raise HTTPException(status_code=404, detail="Pergunta não encontrada")
    return _to_response(f)


async def create_faq(data: FaqCreate) -> FaqResponse:
    all_items = await faq_repo.find_all()
    next_order = len(all_items)
    item = FaqItem(
        question=data.question,
        answer=data.answer,
        is_active=data.is_active,
        order=next_order,
    )
    item = await faq_repo.create(item)
    return _to_response(item)


async def update_faq(id: str, data: FaqUpdate) -> FaqResponse:
    item = await faq_repo.find_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Pergunta não encontrada")
    update_data = data.model_dump(exclude_none=True)
    item = await faq_repo.update(item, update_data)
    return _to_response(item)


async def delete_faq(id: str) -> None:
    item = await faq_repo.find_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Pergunta não encontrada")
    await faq_repo.delete(item)


async def reorder_faqs(data: FaqReorderRequest) -> None:
    await faq_repo.reorder(data.ids)
