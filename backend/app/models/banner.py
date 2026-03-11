from beanie import Document


class Banner(Document):
    title: str
    subtitle: str = ""
    bg_color: str = "#FF6B35"
    text_color: str = "#FFFFFF"
    link_url: str = ""
    link_text: str = ""
    is_active: bool = True
    order: int = 0

    class Settings:
        name = "banners"
