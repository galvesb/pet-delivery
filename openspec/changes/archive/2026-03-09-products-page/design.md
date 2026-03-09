# Design: Página Dedicada de Produtos

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend: /products                                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SearchBar + SortSelect (barra superior)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────┐  ┌────────────────────────────────────────┐  │
│  │ FilterSidebar│  │ ProductGrid (reutilizado/adaptado)     │  │
│  │              │  │                                        │  │
│  │ Categorias   │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │  │
│  │ ☑ Ração      │  │  │Card │ │Card │ │Card │ │Card │    │  │
│  │ ☑ Acessório  │  │  └─────┘ └─────┘ └─────┘ └─────┘    │  │
│  │ ☐ Brinquedo  │  │                                        │  │
│  │              │  │  [Carregar mais...]                     │  │
│  │ Preço        │  │                                        │  │
│  │ R$[__]-[__]  │  └────────────────────────────────────────┘  │
│  └──────────────┘                                               │
│                                                                 │
│  Mobile: [🔽 Filtros] colapsa sidebar                          │
└─────────────────────────────────────────────────────────────────┘
```

## Backend

### Endpoint: `GET /api/v1/products`

Novos query params adicionados ao endpoint existente:

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `search` | string | null | Busca textual ($text) em name+description |
| `sort_by` | enum | `newest` | `newest`, `price_asc`, `price_desc`, `name_asc` |
| `min_price` | float | null | Preço mínimo (>=) |
| `max_price` | float | null | Preço máximo (<=) |
| `categories` | string | null | Slugs separados por vírgula (multi-select) |
| `skip` | int | 0 | Offset para paginação |
| `limit` | int | 20 | Itens por página |

**Resposta adicional**: incluir campo `total` para saber se há mais itens.

```
{
  "items": [ProductResponse, ...],
  "total": 42
}
```

Nota: o endpoint atual retorna `List[ProductResponse]` direto. Criar um novo schema `ProductListResponse` com `items` e `total` para suportar "Carregar mais". O endpoint antigo (sem search/sort) continua funcionando para a homepage.

### Repository: `ProductRepository`

Novo método `search_products()`:

```
async def search_products(
    search, categories, min_price, max_price, sort_by, skip, limit
) -> tuple[list[Product], int]:
```

- **Busca**: `{"$text": {"$search": search}}` — usa índice TEXT existente
- **Categorias multi**: `{"categories": {"$in": [slugs]}}` — substitui `In` do Beanie
- **Preço**: `{"price": {"$gte": min, "$lte": max}}`
- **Ordenação**:
  - `newest` → `sort(-created_at)`
  - `price_asc` → `sort(+price)`
  - `price_desc` → `sort(-price)`
  - `name_asc` → `sort(+name)`
- **Total**: usar `count()` separado para retornar o total de resultados

### Schema: `ProductListResponse`

```python
class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
```

## Frontend

### Nova Página: `ProductsPage`

Localização: `frontend/src/pages/ProductsPage.tsx`

Estado local gerenciado com `useState`:
- `search: string` — texto de busca (debounce 400ms)
- `selectedCategories: string[]` — slugs selecionados
- `minPrice: string` — input min
- `maxPrice: string` — input max
- `sortBy: string` — opção de ordenação
- `products: Product[]` — lista acumulada
- `total: number` — total do backend
- `page: number` — página atual (skip = page * 20)
- `loading: boolean`
- `filtersOpen: boolean` — toggle mobile

### Componentes

#### `SearchBar`
- Input com ícone 🔍
- Debounce de 400ms antes de disparar busca
- Limpa filtros e reseta paginação ao buscar

#### `SortSelect`
- `<select>` com opções: Mais recentes, Menor preço, Maior preço, Nome A-Z
- onChange reseta paginação e recarrega

#### `FilterSidebar`
- **Categorias**: busca lista de categorias via `GET /categories`, exibe checkboxes
- **Preço**: dois inputs numéricos (R$ min / R$ max) com botão "Aplicar"
- No mobile: oculta por padrão, toggle com botão "Filtros"

#### `LoadMoreButton`
- Exibe "Mostrando X de Y produtos"
- Botão "Carregar mais" visível quando `products.length < total`
- onClick incrementa `page`, faz fetch e concatena resultados

### Reutilização

- `ProductGrid` e `ProductCard` já existem e são reutilizados
- `ProductGrid` atual faz fetch interno — na nova página, o fetch será feito no `ProductsPage` e os produtos passados como prop. Criar variante ou adaptar `ProductGrid` para aceitar produtos externos.

### Header

Mudar link "Produtos" de `<a href="/#menu-produtos">` para `<Link to="/products">`.

### Rota

Adicionar em `App.tsx`: `<Route path="/products" element={<ProductsPage />} />`

## CSS

Novos estilos em `global.css`:
- `.products-page` — layout com sidebar + grid (CSS Grid ou Flexbox)
- `.filter-sidebar` — largura fixa ~240px no desktop, full-width no mobile
- `.search-sort-bar` — flexbox row com gap
- `.load-more` — botão centralizado
- Media query: sidebar colapsa em tela < 768px
