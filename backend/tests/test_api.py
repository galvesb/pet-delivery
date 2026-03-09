"""Testes básicos de integração."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_register(client: AsyncClient):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "new@test.com", "password": "Test@1234", "full_name": "New User"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "new@test.com"
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_weak_password(client: AsyncClient):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": "weak@test.com", "password": "password", "full_name": "Weak"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_login(client: AsyncClient, registered_user):
    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "customer@test.com", "password": "Test@1234"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, registered_user):
    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "customer@test.com", "password": "Wrong@1234"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_list_products_public(client: AsyncClient):
    resp = await client.get("/api/v1/products")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_create_product_requires_admin(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/v1/products",
        json={
            "name": "Produto Teste",
            "price": 50.0,
            "image_url": "https://example.com/img.jpg",
            "categories": ["cachorro"],
        },
        headers=auth_headers,
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_list_categories_public(client: AsyncClient):
    resp = await client.get("/api/v1/categories")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_cart_requires_auth(client: AsyncClient):
    resp = await client.get("/api/v1/cart")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_cart_sync(client: AsyncClient, auth_headers):
    resp = await client.patch(
        "/api/v1/cart",
        json={"items": []},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["total"] == 0.0
