from typing import List

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, require_role
from app.db.repositories.user_repo import UserRepository
from app.models.user import User, UserRole
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])
user_repo = UserRepository()


def _to_response(u: User) -> UserResponse:
    return UserResponse(
        id=str(u.id),
        email=u.email,
        full_name=u.full_name,
        role=u.role,
        is_active=u.is_active,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return _to_response(current_user)


@router.get("", response_model=List[UserResponse])
async def list_users(
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    users = await user_repo.find_all()
    return [_to_response(u) for u in users]
