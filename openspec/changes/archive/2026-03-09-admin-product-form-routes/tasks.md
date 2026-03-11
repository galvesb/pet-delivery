# Tasks: Rotas Dedicadas para Formulário de Produto no Admin

- [x] 1. Criar `frontend/src/pages/admin/ProductFormPage.tsx` — usa `useParams()` para obter `id`; se presente, busca `GET /products/:id` e passa como `initial` ao `ProductForm`; se ausente, passa `initial={null}`; `handleSubmit` faz PUT ou POST conforme o modo; após salvar navega para `/admin/products`; botão "← Voltar" e `onCancel` também navegam para `/admin/products`; exibe loading enquanto carrega produto no modo edição

- [x] 2. Refatorar `frontend/src/pages/admin/ProductsPage.tsx` — remover `useState(editing)`, `handleCreate`, `handleUpdate` e o bloco condicional do `ProductForm`; adicionar `useNavigate()`; botão "+ Novo Produto" chama `navigate("/admin/products/new")`; prop `onEdit` do `ProductTable` chama `navigate(`/admin/products/${p.id}/edit`)`; remover import de `ProductForm`

- [x] 3. Atualizar `frontend/src/App.tsx` — importar `ProductFormPage` de `@/pages/admin/ProductFormPage`; adicionar dentro do bloco `ProtectedRoute` admin as rotas `<Route path="/admin/products/new" element={<ProductFormPage />} />` e `<Route path="/admin/products/:id/edit" element={<ProductFormPage />} />`
