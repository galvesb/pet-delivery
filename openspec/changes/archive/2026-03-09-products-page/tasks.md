# Tasks: Página Dedicada de Produtos

## Backend

- [x] 1. Criar schema `ProductListResponse` em `backend/app/schemas/product.py` com campos `items: List[ProductResponse]` e `total: int`
- [x] 2. Adicionar enum/constantes de ordenação (`newest`, `price_asc`, `price_desc`, `name_asc`) em `backend/app/schemas/product.py`
- [x] 3. Criar método `search_products()` no `ProductRepository` que aceite search, categories (lista), min_price, max_price, sort_by, skip, limit e retorne `(list[Product], int)` — usando $text para busca, $in para categorias multi, $gte/$lte para preço, sort dinâmico, e count para total
- [x] 4. Criar função `search_products()` no `product_service.py` que chame o repo e retorne `ProductListResponse`
- [x] 5. Atualizar endpoint `GET /products` em `endpoints/products.py`: adicionar query params `search`, `sort_by`, `min_price`, `max_price`, `categories` (string CSV) e retornar `ProductListResponse` — manter compatibilidade com chamadas existentes (sem search/sort retorna como antes mas no novo formato)

## Frontend — Componentes

- [x] 6. Criar componente `SearchBar` em `frontend/src/components/products/SearchBar.tsx` — input com ícone de busca e debounce de 400ms, recebe `onSearch(term: string)` como prop
- [x] 7. Criar componente `SortSelect` em `frontend/src/components/products/SortSelect.tsx` — select com opções (Mais recentes, Menor preço, Maior preço, Nome A-Z), recebe `value` e `onChange`
- [x] 8. Criar componente `FilterSidebar` em `frontend/src/components/products/FilterSidebar.tsx` — checkboxes de categorias (busca via GET /categories) + inputs de preço min/max com botão "Aplicar", recebe callbacks `onCategoriesChange`, `onPriceChange`
- [x] 9. Criar componente `LoadMoreButton` em `frontend/src/components/products/LoadMoreButton.tsx` — exibe "Mostrando X de Y produtos" + botão "Carregar mais", recebe `shown`, `total`, `loading`, `onLoadMore`

## Frontend — Página

- [x] 10. Criar página `ProductsPage` em `frontend/src/pages/ProductsPage.tsx` — gerencia estado de busca, filtros, ordenação e paginação; faz fetch para `GET /products` com todos os params; layout com SearchBar + SortSelect no topo, FilterSidebar na lateral esquerda, ProductGrid no centro, LoadMoreButton abaixo
- [x] 11. Adaptar `ProductGrid` para aceitar produtos como prop opcional — quando recebe `products` usa eles, quando não recebe faz fetch interno (mantém compatibilidade com homepage)

## Frontend — Integração e Estilos

- [x] 12. Adicionar rota `/products` em `App.tsx` apontando para `ProductsPage`
- [x] 13. Atualizar Header: mudar link "Produtos" de `<a href="/#menu-produtos">` para `<Link to="/products">`
- [x] 14. Adicionar estilos CSS em `global.css`: `.products-page` (layout grid/flex com sidebar), `.filter-sidebar` (240px desktop, colapsável mobile), `.search-sort-bar` (flex row), `.load-more` (centralizado), media queries para responsividade (<768px)
- [x] 15. Atualizar `ProductCatalog` da homepage para funcionar com o novo formato de resposta `ProductListResponse` (extrair `items` da resposta)
