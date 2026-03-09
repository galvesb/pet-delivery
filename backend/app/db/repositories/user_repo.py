from typing import List, Optional

from app.db.repositories.base import BaseRepository
from app.models.user import CartItem, User


class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)

    async def find_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def update_cart(self, user: User, cart: List[CartItem]) -> User:
        await user.set({User.cart: cart})
        return user
