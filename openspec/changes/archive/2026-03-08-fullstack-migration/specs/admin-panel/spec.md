# Spec: Painel Administrativo

## Descrição
Interface web para o admin gerenciar categorias e produtos. Acessível apenas para usuários com role ADMIN.

## Rotas do frontend
| Rota | Página | Descrição |
|------|--------|-----------|
| `/admin` | DashboardPage | Visão geral (contagem de produtos, categorias) |
| `/admin/products` | ProductsPage | Tabela de produtos + formulário criar/editar |
| `/admin/categories` | CategoriesPage | Tabela de categorias + formulário criar/editar |

## Proteção de rotas
- `ProtectedRoute` verifica:
  1. Usuário está autenticado (accessToken presente no Zustand)
  2. Usuário tem `role === "ADMIN"`
- Se não autenticado → redireciona para `/login`
- Se autenticado mas não admin → redireciona para `/` (home)

## Páginas

### DashboardPage
- Cards com contagem: total de produtos, total de categorias
- Links rápidos para as outras páginas admin

### ProductsPage
- **Tabela**: nome, preço, categorias (badges), ações (editar, excluir)
- **Formulário** (modal ou inline): name, description, price, image_url, categories (multi-select com categorias disponíveis)
- **Excluir**: confirmação antes de deletar
- Atualiza a tabela após CRUD

### CategoriesPage
- **Tabela**: name, slug, ações (editar, excluir)
- **Formulário** (modal ou inline): name, slug (auto-gerado a partir do name, editável)
- **Excluir**:
  - Chama DELETE /api/v1/categories/{id}
  - Se 409: exibe **toast warning** com mensagem e lista de produtos
  - Se 204: remove da tabela

## Toast de aviso (exclusão de categoria em uso)
- Tipo: warning (amarelo/laranja)
- Mensagem: "Não é possível excluir. {N} produto(s) usam esta categoria: {lista}"
- Duração: 5 segundos ou dismiss manual
- Biblioteca sugerida: react-hot-toast ou sonner
