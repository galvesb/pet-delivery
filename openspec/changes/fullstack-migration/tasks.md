# Tasks: Migração Full-Stack do HomePet Delivery

## Fase 1: Infraestrutura e Configuração Base

- [x] Criar estrutura de pastas do projeto (backend/, frontend/, conforme design.md)
- [x] Criar `.gitignore` com .env, .make.env, node_modules, __pycache__, backups/, .venv, mongo_data
- [x] Criar `.env.example` na raiz com todas as variáveis (MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_HOST, MONGO_PORT, JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, ALLOWED_ORIGINS, ADMIN_EMAIL, ADMIN_PASSWORD, DEBUG)
- [x] Criar `docker-compose.yml` com 3 serviços (frontend, api, mongodb), 2 redes (public, internal), volume mongo_data, healthcheck do MongoDB
- [x] Criar `backend/Dockerfile` multi-stage (development com hot reload, production com user non-root)
- [x] Criar `frontend/Dockerfile` multi-stage (development com Vite, production com Nginx)
- [x] Criar `frontend/nginx.conf` com SPA fallback, proxy /api/, headers de segurança, gzip
- [x] Criar `Makefile` com targets: deploy, logs, logs-all, status, ssh, health, restart, stop, setup, help
- [x] Criar `.make.env.example` com VM_USER e VM_HOST

## Fase 2: Backend — Core e Configuração

- [x] Criar `backend/pyproject.toml` com dependências (fastapi, uvicorn, motor, beanie, pydantic-settings, python-jose, passlib, slowapi, secure, python-multipart) e dev deps (pytest, pytest-asyncio, httpx, ruff, mypy)
- [x] Criar `backend/app/core/config.py` com Settings (pydantic-settings) carregando todas as variáveis do .env
- [x] Criar `backend/app/core/security.py` com funções: verify_password, hash_password, create_access_token, create_refresh_token
- [x] Criar `backend/app/core/logging.py` com SensitiveDataFilter (redact passwords, tokens)
- [x] Criar `backend/app/db/mongodb.py` com get_motor_client e init_db (init_beanie com todos os models)
- [x] Criar `backend/app/db/repositories/base.py` com BaseRepository genérico (find_by_id, find_all, create, update, delete)

## Fase 3: Backend — Models e Schemas

- [x] Criar `backend/app/models/category.py` — Category Document (name, slug unique, created_at)
- [x] Criar `backend/app/models/product.py` — Product Document (name, description, price, image_url, categories[], is_active, created_at) com índices
- [x] Criar `backend/app/models/user.py` — UserRole enum (ADMIN, CUSTOMER), CartItem model (product_id, name, price, image_url, quantity), User Document (email unique, hashed_password, full_name, role, is_active, cart[])
- [x] Criar `backend/app/models/revoked_token.py` — RevokedToken Document (token_hash, revoked_at, expires_at com TTL index)
- [x] Criar `backend/app/schemas/token.py` — TokenResponse
- [x] Criar `backend/app/schemas/user.py` — UserCreate (com validação senha forte), UserResponse (sem hashed_password)
- [x] Criar `backend/app/schemas/category.py` — CategoryCreate (com validação slug regex), CategoryUpdate, CategoryResponse
- [x] Criar `backend/app/schemas/product.py` — ProductCreate, ProductUpdate, ProductResponse
- [x] Criar `backend/app/schemas/cart.py` — CartItemSchema, CartSyncRequest, CartResponse

## Fase 4: Backend — Repositories e Services

- [x] Criar `backend/app/db/repositories/category_repo.py` — find_by_slug, find_all sorted by name
- [x] Criar `backend/app/db/repositories/product_repo.py` — search com filtro por category/price, find com paginação
- [x] Criar `backend/app/db/repositories/user_repo.py` — find_by_email, update_cart
- [x] Criar `backend/app/services/auth_service.py` — authenticate, register, refresh_token (rotation), logout (revoke), revoke_token, is_token_revoked
- [x] Criar `backend/app/services/category_service.py` — create, update (cascade slug nos products), delete (verificar uso, retornar 409 com lista de products)
- [x] Criar `backend/app/services/product_service.py` — create (validar slugs), update, delete, list com filtro
- [x] Criar `backend/app/services/cart_service.py` — get_cart, sync_cart (validar product_ids existentes), clear_cart

## Fase 5: Backend — API Endpoints e Main

- [x] Criar `backend/app/api/deps.py` — oauth2_scheme, get_current_user, require_role
- [x] Criar `backend/app/api/v1/endpoints/auth.py` — POST register, login, refresh, logout (com rate limiting)
- [x] Criar `backend/app/api/v1/endpoints/products.py` — GET list (público), GET detail (público), POST/PUT/DELETE (ADMIN)
- [x] Criar `backend/app/api/v1/endpoints/categories.py` — GET list (público), POST/PUT/DELETE (ADMIN, com 409 na exclusão)
- [x] Criar `backend/app/api/v1/endpoints/cart.py` — GET, PATCH, DELETE (autenticado)
- [x] Criar `backend/app/api/v1/endpoints/users.py` — GET /me (autenticado), GET /users (ADMIN)
- [x] Criar `backend/app/api/v1/router.py` — agregar todos os routers com prefixos
- [x] Criar `backend/app/middleware/rate_limit.py` — configuração slowapi
- [x] Criar `backend/app/middleware/security_headers.py` — SecureHeaders middleware
- [x] Criar `backend/app/main.py` — FastAPI app com lifespan (init_db + admin seed), CORS, middlewares, router v1, endpoint /health

## Fase 6: Backend — Testes

- [x] Criar `backend/tests/conftest.py` — fixtures (async client, auth_headers, admin_headers)
- [x] Criar testes básicos: test_health, test_register, test_login, test_products_crud, test_categories_crud, test_cart_sync

## Fase 7: Frontend — Setup e Configuração

- [x] Inicializar projeto React + TypeScript com Vite (`npm create vite@latest`)
- [x] Instalar dependências: axios, zustand, react-router-dom, react-hot-toast (ou sonner)
- [x] Criar `frontend/.env.local` com VITE_API_URL
- [x] Criar `frontend/src/types/index.ts` com interfaces: Product, Category, CartItem, User, TokenResponse
- [x] Criar `frontend/src/api/client.ts` — Axios instance com interceptors (auth header + auto refresh em 401)

## Fase 8: Frontend — Stores e Hooks

- [x] Criar `frontend/src/store/authStore.ts` — Zustand: user, accessToken (memória), setToken, setUser, logout
- [x] Criar `frontend/src/store/cartStore.ts` — Zustand: items, addItem, removeItem, clearCart, getTotal, setItems (para merge), debounced sync
- [x] Criar `frontend/src/hooks/useAuth.ts` — login (+ merge carrinho), register, logout
- [x] Criar `frontend/src/hooks/useCart.ts` — wrapper do cartStore com sync API para logados (debounce 500ms)

## Fase 9: Frontend — Componentes Públicos (tradução do HTML)

- [x] Criar `frontend/src/components/layout/Header.tsx` — logo, nav links, cart icon com badge, botão Entrar/perfil, menu toggle mobile
- [x] Criar `frontend/src/components/layout/Footer.tsx` — footer com copyright
- [x] Criar `frontend/src/components/home/Hero.tsx` — seção hero com título, descrição, stats, imagem
- [x] Criar `frontend/src/components/home/ServicesGrid.tsx` — 3 cards de serviços (apresentacional)
- [x] Criar `frontend/src/components/products/CategoryTabs.tsx` — tabs dinâmicas (GET /categories), filtro ativo
- [x] Criar `frontend/src/components/products/ProductCard.tsx` — card com imagem, info, preço, botão add
- [x] Criar `frontend/src/components/products/ProductGrid.tsx` — grid responsiva de ProductCards (GET /products com filtro)
- [x] Criar `frontend/src/components/home/ProductCatalog.tsx` — container CategoryTabs + ProductGrid
- [x] Criar `frontend/src/components/cart/CartOverlay.tsx` — overlay escuro clicável
- [x] Criar `frontend/src/components/cart/CartItem.tsx` — item com imagem, nome, qtd, preço, botão remover
- [x] Criar `frontend/src/components/cart/CartSidebar.tsx` — sidebar com header, lista de CartItems, total, botão finalizar

## Fase 10: Frontend — Páginas de Auth

- [x] Criar `frontend/src/pages/LoginPage.tsx` — formulário email/password, link para registro
- [x] Criar `frontend/src/pages/RegisterPage.tsx` — formulário email/password/full_name, validação client-side
- [x] Criar `frontend/src/components/auth/ProtectedRoute.tsx` — verifica auth + role, redireciona se não autorizado

## Fase 11: Frontend — Painel Admin

- [x] Criar `frontend/src/pages/admin/DashboardPage.tsx` — cards com contagens, links rápidos
- [x] Criar `frontend/src/components/admin/CategoryTable.tsx` — tabela com ações editar/excluir
- [x] Criar `frontend/src/components/admin/CategoryForm.tsx` — formulário name/slug (auto-gerar slug do name)
- [x] Criar `frontend/src/pages/admin/CategoriesPage.tsx` — integra CategoryTable + CategoryForm, toast em 409
- [x] Criar `frontend/src/components/admin/ProductTable.tsx` — tabela com ações editar/excluir
- [x] Criar `frontend/src/components/admin/ProductForm.tsx` — formulário com multi-select de categorias
- [x] Criar `frontend/src/pages/admin/ProductsPage.tsx` — integra ProductTable + ProductForm

## Fase 12: Frontend — Roteamento e App

- [x] Criar `frontend/src/pages/HomePage.tsx` — composição: Hero + ServicesGrid + ProductCatalog
- [x] Criar `frontend/src/App.tsx` — React Router com rotas públicas, autenticadas e admin (ProtectedRoute)
- [x] Criar `frontend/src/main.tsx` — entry point com BrowserRouter, Toaster provider
- [x] Aplicar CSS global preservando o design system atual (cores, fontes Epilogue, border style, shadows, responsivo)

## Fase 13: Revisão Final e Integração

- [x] Verificar que todas as variáveis de ambiente estão no .env.example e documentadas
- [x] Verificar que MongoDB está na rede internal (não exposto externamente)
- [x] Verificar que nenhuma credencial está hardcoded no código
- [x] Verificar que CORS está restrito às origins do .env
- [x] Verificar que Dockerfiles de produção usam user non-root
- [x] Testar fluxo completo: docker compose up → register → login → CRUD admin → carrinho → logout
- [x] Verificar responsividade mobile do frontend
