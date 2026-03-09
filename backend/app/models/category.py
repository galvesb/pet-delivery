from datetime import UTC, datetime

from beanie import Document, Indexed
from pydantic import Field


class Category(Document):
    name: str
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "categories"
        indexes = ["slug"]
