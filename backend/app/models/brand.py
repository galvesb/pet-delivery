from beanie import Document


class Brand(Document):
    name: str
    logo_url: str
    is_active: bool = True
    order: int = 0

    class Settings:
        name = "brands"
