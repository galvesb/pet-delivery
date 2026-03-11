# Design: Rotas Dedicadas para Formulário de Produto no Admin

## Fluxo de Navegação

```
/admin/products
  ├── [+ Novo Produto] → navigate("/admin/products/new")
  └── [Editar]         → navigate(`/admin/products/${id}/edit`)

/admin/products/new
  ├── [← Voltar]   → navigate("/admin/products")
  ├── [Cancelar]   → navigate("/admin/products")
  └── [Salvar] POST → navigate("/admin/products")

/admin/products/:id/edit
  ├── Carrega produto via GET /products/:id
  ├── [← Voltar]   → navigate("/admin/products")
  ├── [Cancelar]   → navigate("/admin/products")
  └── [Salvar] PUT → navigate("/admin/products")
```

## Arquivos Modificados

### `frontend/src/App.tsx`
Adicionar duas novas rotas dentro do bloco admin protegido:
```
<Route path="/admin/products/new"      element={<ProductFormPage />} />
<Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
```
Ambas protegidas pelo `ProtectedRoute requiredRole="ADMIN"` já existente.

### `frontend/src/pages/admin/ProductsPage.tsx`
Remover:
- `useState` para `editing`
- `handleCreate` e `handleUpdate`
- O bloco condicional `{editing !== undefined && <ProductForm .../>}`
- Import de `ProductForm`

Adicionar:
- `useNavigate()`
- Botão "+ Novo" chama `navigate("/admin/products/new")`
- Prop `onEdit` do `ProductTable` chama `navigate(`/admin/products/${p.id}/edit`)`

### `frontend/src/pages/admin/ProductFormPage.tsx` (novo)
Lógica:
- `useParams()` para obter `id` (undefined se rota `/new`)
- Se `id` existe: `GET /products/:id` para carregar o produto como `initial`
- Se `id` não existe: `initial = null`
- `handleSubmit`:
  - se `id`: `PUT /products/:id` + toast "Produto atualizado!" + `navigate("/admin/products")`
  - se não: `POST /products` + toast "Produto criado!" + `navigate("/admin/products")`
- Loading state enquanto carrega o produto no modo edição

Layout:
```
┌────────────────────────────────────────┐
│  ← Voltar                              │
│  h1: Novo Produto / Editar Produto     │
├────────────────────────────────────────┤
│                                        │
│  <ProductForm                          │
│    initial={null | Product}            │
│    onSubmit={handleSubmit}             │
│    onCancel={() => navigate(...)}      │
│  />                                    │
│                                        │
└────────────────────────────────────────┘
```

## Estado de Loading no Modo Edição

```
id presente
    │
    ▼
GET /products/:id
    │
  ┌─┴──────────────┐
  │ loading = true  │  → exibe "Carregando..."
  └────────────────┘
    │
  resposta OK
    │
    ▼
initial = Product
loading = false → renderiza ProductForm
    │
  resposta 404
    │
    ▼
navigate("/admin/products")  (produto não existe)
```

## Imports em App.tsx

```tsx
import { ProductFormPage } from "@/pages/admin/ProductFormPage";
```
(Sem conflito de nomes pois é um arquivo novo)
