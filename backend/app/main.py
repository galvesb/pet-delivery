import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.api.v1.router import router
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.security import hash_password
from app.db.mongodb import get_motor_client, init_db
from app.middleware.rate_limit import limiter
from app.middleware.security_headers import SecurityHeadersMiddleware

setup_logging()
logger = logging.getLogger(__name__)


async def _seed_admin() -> None:
    """Cria o primeiro admin se ADMIN_EMAIL e ADMIN_PASSWORD estiverem definidos."""
    if not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        return

    from app.models.user import User, UserRole

    existing = await User.find_one(User.email == settings.ADMIN_EMAIL)
    if existing:
        logger.info("Admin seed: já existe (%s)", settings.ADMIN_EMAIL)
        return

    admin = User(
        email=settings.ADMIN_EMAIL,
        hashed_password=hash_password(settings.ADMIN_PASSWORD),
        full_name="Administrador",
        role=UserRole.ADMIN,
    )
    await admin.insert()
    logger.info("Admin seed: criado (%s)", settings.ADMIN_EMAIL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = get_motor_client()
    await init_db(client)
    await _seed_admin()
    logger.info("Aplicação iniciada")
    yield
    client.close()
    logger.info("Aplicação encerrada")


app = FastAPI(
    title="HomePet Delivery API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — nunca "*" em produção
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)

# Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# Rotas
app.include_router(router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "app": "HomePet Delivery API"}
