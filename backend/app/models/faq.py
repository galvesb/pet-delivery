from beanie import Document


class FaqItem(Document):
    question: str
    answer: str
    order: int = 0
    is_active: bool = True

    class Settings:
        name = "faqs"
