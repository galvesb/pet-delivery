# Design: Migração Full-Stack do HomePet Delivery

## Visão geral da arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Docker Compose                               │
│                                                                     │
│  ┌──────────────────┐   ┌──────────────────┐   ┌───────────────┐  │
│  │    Frontend       │   │    Backend (API)  │   │   MongoDB     │  │
│  │  React + Vite     │   │  FastAPI + Beanie │   │   mongo:7     │  │
│  │  TypeScript       │   │  Python 3.12      │   │               │  │
│  │  Zustand          │   │  Clean Arch       │   │  rede:        │  │
│  │                   │   │                   │   │  internal     │  │
│  │  porta: 80        │   │  porta: 8000      │   │  (isolado)    │  │
│  │  rede: public     │   │  rede: public +   │   │               │  │
│  │                   │   │        internal    │   │               │  │
│  └────────┬──────────┘   └────────┬──────────┘   └───────────────┘  │
│           │                       │                                  │
│           │  Nginx /api/* proxy   │   Motor (async)                  │
│           └───────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Estrutura de pastas

```
petshop-delivery/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py         # login, register, refresh, logout
│   │   │   │   │   ├── products.py     # CRUD (admin) + listagem (público)
│   │   │   │   │   ├── categories.py   # CRUD (admin) + listagem (público)
│   │   │   │   │   ├── cart.py         # GET, PATCH, DELETE (autenticado)
│   │   │   │   │   └── users.py        # GET /me, GET /users (admin)
│   │   │   │   └── router.py
│   │   │   └── deps.py                # get_current_user, require_role
│   │   ├── core/
│   │   │   ├── config.py              # pydantic-settings (.env)
│   │   │   ├── security.py            # JWT, bcrypt, token rotation
│   │   │   └── logging.py             # Filtro de dados sensíveis
│   │   ├── db/
│   │   │   ├── mongodb.py             # Motor client + init_beanie
│   │   │   └── repositories/
│   │   │       ├── base.py
│   │   │       ├── user_repo.py
│   │   │       ├── product_repo.py
│   │   │       └── category_repo.py
│   │   ├── models/
│   │   │   ├── user.py                # User + CartItem (subdoc) + UserRole
│   │   │   ├── product.py             # Product
│   │   │   ├── category.py            # Category
│   │   │   └── revoked_token.py       # RevokedToken (TTL index)
│   │   ├── schemas/
│   │   │   ├── user.py                # UserCreate, UserResponse
│   │   │   ├── product.py             # ProductCreate, ProductResponse
│   │   │   ├── category.py            # CategoryCreate, CategoryResponse
│   │   │   ├── cart.py                # CartItemSchema, CartSync
│   │   │   └── token.py               # TokenResponse
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── product_service.py
│   │   │   ├── category_service.py
│   │   │   └── cart_service.py
│   │   ├── middleware/
│   │   │   ├── rate_limit.py
│   │   │   └── security_headers.py
│   │   └── main.py                    # lifespan (init_db + admin seed)
│   ├── tests/
│   │   └── conftest.py
│   ├── .env.example
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts              # Axios + interceptors (refresh)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── ServicesGrid.tsx
│   │   │   │   └── ProductCatalog.tsx
│   │   │   ├── products/
│   │   │   │   ├── CategoryTabs.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   └── ProductCard.tsx
│   │   │   ├── cart/
│   │   │   │   ├── CartSidebar.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartOverlay.tsx
│   │   │   ├── admin/
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   └── CategoryTable.tsx
│   │   │   └── auth/
│   │   │       └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useCart.ts
│   │   ├── store/
│   │   │   ├── authStore.ts           # Zustand: user + accessToken (memória)
│   │   │   └── cartStore.ts           # Zustand: items + merge logic
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── admin/
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── ProductsPage.tsx
│   │   │       └── CategoriesPage.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── nginx.conf
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── Makefile
├── .env.example
├── .make.env              # local, fora do git
├── .gitignore
└── CLAUDE.md
```

## Modelos de dados (MongoDB)

### Category
```
{
  _id: ObjectId,
  name: "Para Cachorros",
  slug: "cachorro",           // unique index
  created_at: ISODate
}
```

### Product
```
{
  _id: ObjectId,
  name: "Osso de Borracha Resistente",
  description: "Brinquedos • Cachorro",
  price: 45.00,
  image_url: "https://...",
  categories: ["cachorro", "acessorios"],   // array de slugs
  is_active: true,
  created_at: ISODate
}
Índices: [("categories", 1), ("price", 1)], text index em name+description
```

### User
```
{
  _id: ObjectId,
  email: "user@example.com",       // unique index
  hashed_password: "$2b$...",
  full_name: "João Silva",
  role: "CUSTOMER",                // enum: ADMIN | CUSTOMER
  is_active: true,
  cart: [                          // subdocumento
    {
      product_id: "ObjectId_str",
      name: "Osso de Borracha",
      price: 45.00,
      image_url: "https://...",
      quantity: 2
    }
  ]
}
```

### RevokedToken
```
{
  _id: ObjectId,
  token_hash: "sha256...",        // index
  revoked_at: ISODate,
  expires_at: ISODate             // TTL index (auto-cleanup)
}
```

## Endpoints da API

### Auth (público)
| Método | Rota | Descrição | Rate Limit |
|--------|------|-----------|------------|
| POST | `/api/v1/auth/register` | Registro de novo usuário | 5/min |
| POST | `/api/v1/auth/login` | Login (retorna access token + refresh cookie) | 5/min |
| POST | `/api/v1/auth/refresh` | Refresh token rotation | 10/min |
| POST | `/api/v1/auth/logout` | Revoga refresh token, limpa cookie | - |

### Products
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/v1/products` | Público | Lista produtos (filtro: `?category=slug`) |
| GET | `/api/v1/products/{id}` | Público | Detalhe do produto |
| POST | `/api/v1/products` | ADMIN | Criar produto |
| PUT | `/api/v1/products/{id}` | ADMIN | Atualizar produto |
| DELETE | `/api/v1/products/{id}` | ADMIN | Excluir produto |

### Categories
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/v1/categories` | Público | Lista todas as categorias |
| POST | `/api/v1/categories` | ADMIN | Criar categoria |
| PUT | `/api/v1/categories/{id}` | ADMIN | Atualizar categoria |
| DELETE | `/api/v1/categories/{id}` | ADMIN | Excluir (409 se em uso + lista de produtos) |

### Cart (autenticado)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/cart` | Retorna carrinho do user logado |
| PATCH | `/api/v1/cart` | Sync completo (recebe array de items) |
| DELETE | `/api/v1/cart` | Limpa carrinho |

### Users
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/v1/users/me` | Autenticado | Perfil do usuário logado |
| GET | `/api/v1/users` | ADMIN | Lista todos os usuários |

## Fluxo do carrinho híbrido

```
VISITANTE (sem auth)              LOGADO (com JWT)
─────────────────────             ─────────────────────
Zustand cartStore                 Zustand cartStore
  └── addItem()                     └── addItem()
  └── removeItem()                  └── removeItem()
  └── state em memória              └── state em memória
                                          │
                                          ├── debounce 500ms
                                          ▼
                                    PATCH /api/v1/cart
                                    (sync para MongoDB)

                 ┌── FLUXO DE LOGIN ──┐
                 │                     │
                 │  1. POST /auth/login │
                 │  2. GET /cart (server)│
                 │  3. MERGE:           │
                 │     local + server   │
                 │     mesmo id → soma  │
                 │  4. PATCH /cart       │
                 │     (merged result)  │
                 │  5. Zustand = merged │
                 └─────────────────────┘
```

## Seed do admin

No `lifespan` do FastAPI:
1. Lê `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`
2. Verifica se User com esse email já existe
3. Se não existe → cria com `role=ADMIN`, senha hasheada com bcrypt
4. Se existe → skip (idempotente)
5. Log: "Admin seed: created" ou "Admin seed: already exists"

Variáveis no `.env.example`:
```
ADMIN_EMAIL=admin@homepet.com
ADMIN_PASSWORD=TROQUE_ISSO_SenhaF0rte!@#
```

## Segurança aplicada

### Backend
- Senhas: bcrypt via passlib
- JWT: SECRET_KEY forte via `openssl rand -hex 32`
- Access token: vida curta (30 min), retornado no body
- Refresh token: cookie HttpOnly + Secure + SameSite=Strict
- Refresh rotation: novo par a cada refresh, anterior revogado (blacklist MongoDB + TTL)
- Rate limiting: slowapi em auth endpoints
- CORS: origins restritas via `.env` (nunca `*`)
- Headers: secure (CSP, HSTS, X-Frame-Options, nosniff)
- MongoDB: usuário com permissão mínima, rede internal isolada
- Validação: Pydantic rigorosa em todos os inputs
- Logging: filtro de dados sensíveis (senhas, tokens)
- NoSQL injection: inputs sanitizados via Pydantic, sem operadores MongoDB expostos

### Frontend
- Access token: apenas em memória (Zustand), nunca localStorage
- Refresh: `withCredentials: true` para cookies HttpOnly
- Interceptor Axios: auto-refresh em 401
- Rotas protegidas: `ProtectedRoute` com role check
- Sem `dangerouslySetInnerHTML`

## Infraestrutura Docker

### Redes
- `public`: frontend + backend (acessíveis externamente)
- `internal`: backend + mongodb (MongoDB isolado do mundo externo)

### Dockerfiles
- Backend: multi-stage (development com hot reload / production com `USER appuser`)
- Frontend: multi-stage (development com Vite / production com Nginx)

### Deploy (Magalu Cloud)
- `.make.env` local com `VM_USER` e `VM_HOST`
- `Makefile` com targets: deploy, logs, status, ssh, health, restart, stop, setup
- `.env` criado manualmente na VM (nunca no git)
- Fluxo: `make deploy` → rsync + docker compose up --build -d
