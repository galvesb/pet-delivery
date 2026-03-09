import hashlib
from datetime import UTC, datetime
from typing import Optional

from jose import JWTError, jwt

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.db.repositories.user_repo import UserRepository
from app.models.revoked_token import RevokedToken
from app.models.user import User, UserRole
from app.schemas.user import UserCreate

user_repo = UserRepository()


async def authenticate(email: str, password: str) -> Optional[User]:
    user = await user_repo.find_by_email(email)
    if not user or not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def register(data: UserCreate) -> User:
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=UserRole.CUSTOMER,
    )
    return await user_repo.create(user)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


async def revoke_token(token: str) -> None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, [settings.ALGORITHM])
        expires_at = datetime.fromtimestamp(payload["exp"], UTC)
        token_hash = _hash_token(token)
        await RevokedToken(
            token_hash=token_hash,
            expires_at=expires_at,
        ).insert()
    except JWTError:
        pass  # token inválido, não precisa revogar


async def is_token_revoked(token: str) -> bool:
    token_hash = _hash_token(token)
    return (
        await RevokedToken.find_one(RevokedToken.token_hash == token_hash) is not None
    )


async def do_refresh(refresh_token: str) -> tuple[str, str]:
    """Valida refresh token, revoga, emite novo par. Retorna (access, refresh)."""
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, [settings.ALGORITHM])
    except JWTError:
        raise ValueError("Token inválido ou expirado")

    if payload.get("type") != "refresh":
        raise ValueError("Token inválido")

    if await is_token_revoked(refresh_token):
        raise ValueError("Token revogado")

    user_id: str = payload.get("sub", "")
    user = await User.get(user_id)
    if not user or not user.is_active:
        raise ValueError("Usuário não encontrado ou inativo")

    await revoke_token(refresh_token)

    new_access = create_access_token(user_id)
    new_refresh = create_refresh_token(user_id)
    return new_access, new_refresh
