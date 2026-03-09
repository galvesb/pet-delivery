# Spec: Produtos

## Descrição
CRUD de produtos com listagem pública e filtro por categoria. Escrita restrita a ADMIN.

## Modelo: Product
| Campo | Tipo | Regras |
|-------|------|--------|
| name | str | min 2, max 200 |
| description | str | max 500 |
| price | float | > 0 |
| image_url | str | URL válida (HttpUrl) |
| categories | list[str] | array de slugs de categorias existentes |
| is_active | bool | default True |
| created_at | datetime | auto (UTC) |

## Índices
- Composto: `(categories, 1), (price, 1)` — queries de filtro
- Text: `(name, TEXT), (description, TEXT)` — busca futura

## Endpoints

### GET /api/v1/products (público)
- Query params: `category` (slug), `skip`, `limit` (default 20)
- Se `category` fornecido: filtra onde `categories` contém o slug
- Retorna lista de ProductResponse
- Ordenação: created_at desc

### GET /api/v1/products/{id} (público)
- Retorna ProductResponse ou 404

### POST /api/v1/products (ADMIN)
- Body: ProductCreate (name, description, price, image_url, categories)
- Valida que todos os slugs de categories existem na coleção Category
- Retorna 201 + ProductResponse

### PUT /api/v1/products/{id} (ADMIN)
- Body: ProductUpdate (todos opcionais)
- Se categories fornecido, valida existência dos slugs
- Retorna ProductResponse ou 404

### DELETE /api/v1/products/{id} (ADMIN)
- Retorna 204 ou 404

## Validações
- `price` deve ser positivo (Pydantic `gt=0`)
- `categories` deve conter pelo menos 1 slug
- Todos os slugs devem referenciar Categories existentes (validação no service)
- `image_url` validada como HttpUrl pelo Pydantic
