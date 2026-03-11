# Design: Redesign da HomePage com Novas Seções

## Visão Geral da Arquitetura

```
┌── Backend (FastAPI) ──────────────────────────────────────────────┐
│                                                                    │
│  Models (Beanie)          Repos              Services              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │ Banner       │───▶│ BannerRepo   │───▶│ banner_svc   │──┐     │
│  │ Brand        │───▶│ BrandRepo    │───▶│ brand_svc    │──┤     │
│  │ Product (+)  │    │              │    │              │  │     │
│  └──────────────┘    └──────────────┘    └──────────────┘  │     │
│                                                             │     │
│  Endpoints                                                  │     │
│  ┌──────────────────────────────────────────────────────┐   │     │
│  │ GET /banners              (público)                  │◀──┘     │
│  │ POST/PUT/DELETE /banners  (admin)                    │         │
│  │ GET /brands               (público)                  │         │
│  │ POST/PUT/DELETE /brands   (admin)                    │         │
│  │ GET /products?featured=true (filtro novo)            │         │
│  └──────────────────────────────────────────────────────┘         │
└───────────────────────────────────────────────────────────────────┘

┌── Frontend (React) ───────────────────────────────────────────────┐
│                                                                    │
│  HomePage                                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Hero (existente)                                           │   │
│  │ PromoBanner      ← GET /banners                           │   │
│  │ FeaturedProducts ← GET /products?featured=true&limit=4    │   │
│  │ HowItWorks       ← estático                               │   │
│  │ ServicesGrid (existente)                                   │   │
│  │ Testimonials     ← estático                                │   │
│  │ BrandPartners    ← GET /brands                            │   │
│  │ ContactSection   ← estático + OpenStreetMap iframe         │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Admin                                                            │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ /admin/banners          → BannersPage (CRUD)              │   │
│  │ /admin/banners/new      → BannerFormPage                  │   │
│  │ /admin/banners/:id/edit → BannerFormPage                  │   │
│  │ /admin/brands           → BrandsPage (CRUD)               │   │
│  │ /admin/brands/new       → BrandFormPage                   │   │
│  │ /admin/brands/:id/edit  → BrandFormPage                   │   │
│  └────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

## Backend

### 1. Model: Banner

Arquivo: `backend/app/models/banner.py`

```python
class Banner(Document):
    title: str                    # "Frete Grátis!"
    subtitle: str = ""            # "Em compras acima de R$150"
    bg_color: str = "#FF6B35"     # cor de fundo
    text_color: str = "#FFFFFF"   # cor do texto
    link_url: str = ""            # "/products" (opcional)
    link_text: str = ""           # "Aproveitar" (opcional)
    is_active: bool = True
    order: int = 0                # menor = primeiro

    class Settings:
        name = "banners"
```

### 2. Model: Brand

Arquivo: `backend/app/models/brand.py`

```python
class Brand(Document):
    name: str                     # "Royal Canin"
    logo_url: str                 # "/uploads/brands/uuid.webp"
    is_active: bool = True
    order: int = 0                # menor = primeiro

    class Settings:
        name = "brands"
```

### 3. Model Product — Novo campo

Arquivo: `backend/app/models/product.py` (modificação)

Adicionar: `is_featured: bool = False`

### 4. Schemas

**Banner schemas** (`backend/app/schemas/banner.py`):
- `BannerCreate`: title (2-200 chars), subtitle (max 500), bg_color (regex hex), text_color (regex hex), link_url (max 500), link_text (max 100), is_active, order
- `BannerUpdate`: todos opcionais
- `BannerResponse`: id + todos os campos

**Brand schemas** (`backend/app/schemas/brand.py`):
- `BrandCreate`: name (2-100 chars), logo_url (required), is_active, order
- `BrandUpdate`: todos opcionais
- `BrandResponse`: id + todos os campos

**Product schemas** (modificação):
- `ProductCreate`: adicionar `is_featured: bool = False`
- `ProductUpdate`: adicionar `is_featured: Optional[bool] = None`
- `ProductResponse`: adicionar `is_featured: bool`

### 5. Repositories

**BannerRepository** (`backend/app/db/repositories/banner_repo.py`):
- Herda de `BaseRepository[Banner]`
- `find_active()`: retorna banners ativos ordenados por `order`

**BrandRepository** (`backend/app/db/repositories/brand_repo.py`):
- Herda de `BaseRepository[Brand]`
- `find_active()`: retorna brands ativos ordenados por `order`

**ProductRepository** (modificação):
- `search_products()`: adicionar suporte ao filtro `featured: Optional[bool]` no dict de filters

### 6. Services

Seguem o mesmo padrão do `product_service.py`:
- `banner_service.py`: create, update, delete, list (active), get
- `brand_service.py`: create, update, delete, list (active), get

### 7. Endpoints

**Banners** (`backend/app/api/v1/endpoints/banners.py`):
```
GET    /banners          → lista ativos (público)
GET    /banners/all      → lista todos (admin)
POST   /banners          → cria (admin)
PUT    /banners/:id      → atualiza (admin)
DELETE /banners/:id      → remove (admin)
```

**Brands** (`backend/app/api/v1/endpoints/brands.py`):
```
GET    /brands           → lista ativos (público)
GET    /brands/all       → lista todos (admin)
POST   /brands           → cria (admin)
PUT    /brands/:id       → atualiza (admin)
DELETE /brands/:id       → remove (admin)
```

**Products** (modificação):
- `GET /products` recebe novo query param `featured: Optional[bool]`

### 8. init_beanie — Registrar novos models

Arquivo: `backend/app/db/mongodb.py` — adicionar Banner e Brand ao `document_models`

### 9. Router — Registrar novos endpoints

Arquivo: `backend/app/api/v1/router.py` — incluir `banners.router` e `brands.router`

## Frontend

### 1. Tipos TypeScript

Arquivo: `frontend/src/types/index.ts` — adicionar:

```typescript
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bg_color: string;
  text_color: string;
  link_url: string;
  link_text: string;
  is_active: boolean;
  order: number;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  order: number;
}
```

Modificar `Product`: adicionar `is_featured: boolean`

### 2. Componentes Home (novos)

Todos em `frontend/src/components/home/`:

**PromoBanner.tsx**
- Busca `GET /banners` na montagem
- Se nenhum banner ativo, não renderiza nada
- Mostra o primeiro banner ativo como strip horizontal
- Usa `bg_color` e `text_color` como inline styles
- Se `link_url` presente, mostra botão com `link_text`

**FeaturedProducts.tsx**
- Busca `GET /products?featured=true&limit=4`
- Grid 4 colunas (desktop), 2 colunas (mobile)
- Cards com imagem (cover_url), nome, preço, botão "Ver"
- Link "Ver todos os produtos" → `/products`
- Se nenhum produto featured, não renderiza a seção

**HowItWorks.tsx**
- 3 cards estáticos:
  1. "Escolha seus produtos" (ícone carrinho)
  2. "Pague online" (ícone cartão)
  3. "Receba em casa" (ícone pacote)
- Layout: 3 colunas (desktop), stack vertical (mobile)

**Testimonials.tsx**
- 3 depoimentos hardcoded:
  1. "Entrega super rápida! Meu cachorro amou a ração." — Maria S. ⭐⭐⭐⭐⭐
  2. "Ótima variedade de produtos e preços justos." — João P. ⭐⭐⭐⭐⭐
  3. "Serviço excelente, sempre compro aqui." — Ana L. ⭐⭐⭐⭐⭐
- Layout: 3 cards lado a lado (desktop), stack (mobile)

**BrandPartners.tsx**
- Busca `GET /brands` na montagem
- Exibe logos em linha horizontal com gap
- Imagens com max-height ~60px, grayscale filter (hover = color)
- Se nenhuma marca, não renderiza

**ContactSection.tsx**
- Duas colunas (desktop), stack (mobile):
  - Coluna esquerda: dados da loja
    - Endereço: Rua Victor Augusto Mesquita, 458 - Massaguaçu - Caraguatatuba
    - Telefone: (11) 96341-6515 (link `tel:`)
    - Horário: Seg-Sáb, 8h às 19h
    - Instagram: ícone + link
  - Coluna direita: OpenStreetMap iframe embed
    - Coordenadas de Massaguaçu, Caraguatatuba
    - iframe com `loading="lazy"`, border-radius

### 3. Remoção

- Remover `ProductCatalog` do `HomePage.tsx`
- Remover o import de `ProductCatalog`
- O arquivo `ProductCatalog.tsx` pode ser mantido ou removido (não é usado em outro lugar)

### 4. HomePage — Nova composição

```tsx
<Hero />
<PromoBanner />
<FeaturedProducts />
<HowItWorks />
<ServicesGrid />
<Testimonials />
<BrandPartners />
<ContactSection />
```

### 5. Admin — Novas páginas

Seguem o mesmo padrão de `ProductsPage` + `ProductFormPage`:

**BannersPage** (`frontend/src/pages/admin/BannersPage.tsx`):
- Lista banners com tabela (title, is_active, order, ações)
- Botão "+ Novo Banner" → `/admin/banners/new`
- Editar → `/admin/banners/:id/edit`
- Excluir com confirmação

**BannerFormPage** (`frontend/src/pages/admin/BannerFormPage.tsx`):
- Formulário: title, subtitle, bg_color (color picker), text_color (color picker), link_url, link_text, order, is_active (toggle)
- Preview do banner ao vivo enquanto edita
- Modo create/edit via `useParams()`

**BrandsPage** (`frontend/src/pages/admin/BrandsPage.tsx`):
- Lista marcas com tabela (logo thumbnail, name, order, ações)
- Botão "+ Nova Marca" → `/admin/brands/new`

**BrandFormPage** (`frontend/src/pages/admin/BrandFormPage.tsx`):
- Formulário: name, logo (usa ImageUploader existente, limite 1 imagem), order, is_active
- Modo create/edit via `useParams()`

### 6. ProductForm — Checkbox featured

Adicionar checkbox "Produto em destaque" no `ProductForm.tsx` existente.

### 7. Rotas Admin (App.tsx)

Adicionar dentro do bloco `ProtectedRoute` admin:
```tsx
<Route path="/admin/banners" element={<BannersPage />} />
<Route path="/admin/banners/new" element={<BannerFormPage />} />
<Route path="/admin/banners/:id/edit" element={<BannerFormPage />} />
<Route path="/admin/brands" element={<BrandsPage />} />
<Route path="/admin/brands/new" element={<BrandFormPage />} />
<Route path="/admin/brands/:id/edit" element={<BrandFormPage />} />
```

### 8. DashboardPage — Links

Adicionar cards/links para "Banners" e "Marcas" no dashboard admin.

## CSS

Todas as novas seções usam o padrão existente: `section.nome-secao.container` com classes BEM-like.

Responsividade:
- Desktop (>1024px): layouts multi-coluna
- Tablet (768-1024px): ajustes de grid
- Mobile (<768px): stack vertical, cards full-width
