# Spec: Categorias

## Descrição
CRUD de categorias dinâmicas gerenciadas pelo admin. Categorias são usadas para filtrar produtos no catálogo público.

## Modelo: Category
| Campo | Tipo | Regras |
|-------|------|--------|
| name | str | min 2, max 100 (ex: "Para Cachorros") |
| slug | str | unique, lowercase, kebab (ex: "cachorro") |
| created_at | datetime | auto (UTC) |

## Índices
- Unique: `slug`

## Endpoints

### GET /api/v1/categories (público)
- Retorna lista de CategoryResponse
- Sem paginação (quantidade pequena)
- Ordenação: name asc

### POST /api/v1/categories (ADMIN)
- Body: CategoryCreate (name, slug)
- Slug deve ser lowercase, alfanumérico com hífens
- Retorna 201 + CategoryResponse
- Erro 409 se slug já existe

### PUT /api/v1/categories/{id} (ADMIN)
- Body: CategoryUpdate (name e/ou slug, opcionais)
- Se slug alterado: verificar unicidade
- Se slug alterado: atualizar `categories[]` em todos os Products que usavam o slug antigo
- Retorna CategoryResponse ou 404

### DELETE /api/v1/categories/{id} (ADMIN)
- Verifica se existem produtos usando esta categoria (slug presente em `Product.categories`)
- Se existem: retorna **409 Conflict** com body:
  ```json
  {
    "detail": "Categoria em uso por produtos",
    "products": ["Osso de Borracha Resistente", "Coleira Peitoral com Guia"]
  }
  ```
- Se não existem: remove e retorna 204
- Frontend: exibe toast warning com a lista de produtos

## Validações
- `slug`: regex `^[a-z0-9]+(-[a-z0-9]+)*$` (Pydantic field_validator)
- `name`: strip de espaços extras
