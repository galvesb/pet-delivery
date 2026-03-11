from fastapi import APIRouter

from app.api.v1.endpoints import auth, banners, brands, cart, categories, products, uploads, users

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router)
router.include_router(products.router)
router.include_router(categories.router)
router.include_router(cart.router)
router.include_router(users.router)
router.include_router(uploads.router)
router.include_router(banners.router)
router.include_router(brands.router)
