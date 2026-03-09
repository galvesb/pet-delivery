from typing import List

from fastapi import APIRouter, Depends, UploadFile

from app.api.deps import require_role
from app.models.user import User, UserRole
from app.services import upload_service

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/images", response_model=dict)
async def upload_images(
    files: List[UploadFile],
    _: User = Depends(require_role(UserRole.ADMIN)),
) -> dict:
    urls = await upload_service.process_and_save_many(files)
    return {"urls": urls}
