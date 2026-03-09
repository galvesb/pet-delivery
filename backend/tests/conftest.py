import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def registered_user(client: AsyncClient):
    resp = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "customer@test.com",
            "password": "Test@1234",
            "full_name": "Test Customer",
        },
    )
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture
async def auth_headers(client: AsyncClient, registered_user):
    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "customer@test.com", "password": "Test@1234"},
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def admin_headers(client: AsyncClient):
    """Cria um admin diretamente no DB e retorna headers."""
    from app.core.security import hash_password
    from app.models.user import User, UserRole

    admin = User(
        email="admin@test.com",
        hashed_password=hash_password("Admin@1234"),
        full_name="Test Admin",
        role=UserRole.ADMIN,
    )
    await admin.insert()
    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "admin@test.com", "password": "Admin@1234"},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
