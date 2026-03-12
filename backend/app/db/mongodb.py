from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings


def get_motor_client() -> AsyncIOMotorClient:
    return AsyncIOMotorClient(
        settings.MONGODB_URL,
        maxPoolSize=50,
        minPoolSize=10,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        retryWrites=True,
        w="majority",
    )


async def init_db(client: AsyncIOMotorClient) -> None:
    # Importação aqui para evitar circular imports
    from app.models.banner import Banner
    from app.models.brand import Brand
    from app.models.category import Category
    from app.models.faq import FaqItem
    from app.models.product import Product
    from app.models.user import User
    from app.models.revoked_token import RevokedToken

    db = client[settings.MONGO_DB]
    await init_beanie(
        database=db,
        document_models=[Banner, Brand, Category, FaqItem, Product, User, RevokedToken],
    )
