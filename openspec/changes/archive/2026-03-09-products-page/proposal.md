# Proposal: Página Dedicada de Produtos (/products)

## Problema

Atualmente, os produtos são exibidos apenas na homepage, misturados com seções institucionais (Hero, Serviços). Clientes que querem navegar pelos produtos precisam rolar a página inteira. Além disso, não há busca, ordenação por preço, nem filtros avançados — o único filtro disponível são as tabs de categoria.

## Solução

Criar uma página dedicada `/products` com experiência completa de catálogo:

- **Barra de busca** por nome/descrição (usando índice TEXT do MongoDB)
- **Sidebar de filtros** com checkboxes de categoria (multi-select) e faixa de preço (min/max)
- **Ordenação**: mais recentes, menor preço, maior preço, nome A-Z
- **Paginação**: botão "Carregar mais" (load more)
- **Responsivo**: sidebar colapsa em toggle no mobile

A homepage (`/`) permanece inalterada com Hero + ServicesGrid + ProductCatalog.

## Escopo

### Inclui
- Nova página frontend `ProductsPage` na rota `/products`
- Componentes: SearchBar, SortSelect, FilterSidebar (CategoryCheckboxes + PriceRangeInputs), LoadMoreButton
- Backend: novos query params no `GET /products` — `search`, `sort_by`, `min_price`, `max_price`, `categories` (multi)
- Atualização do repo para suportar busca textual e ordenação
- Header: link "Produtos" aponta para `/products` em vez de `/#menu-produtos`

### Não inclui
- Alterações na homepage
- Busca com autocomplete/sugestões
- Filtros por marca ou avaliação
- Paginação numérica
