from datetime import UTC, datetime

from beanie import Document
from pydantic import Field
from pymongo import ASCENDING, IndexModel


class RevokedToken(Document):
    token_hash: str
    revoked_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    expires_at: datetime  # TTL index — MongoDB remove automaticamente

    class Settings:
        name = "revoked_tokens"
        indexes = [
            IndexModel([("token_hash", ASCENDING)]),
            IndexModel([("expires_at", ASCENDING)], expireAfterSeconds=0),
        ]
