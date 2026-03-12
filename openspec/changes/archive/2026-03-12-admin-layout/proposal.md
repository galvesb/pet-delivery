# Proposal: Layout Separado para o Painel Admin

## Problema

O painel administrativo utiliza o mesmo shell visual da loja pública: PromoBanner ("Frete grátis..."), Header com navegação pública (Início, Serviços, Produtos), ícone de carrinho e Footer com copyright. Para um administrador gerenciando produtos, banners ou FAQs, todos esses elementos são ruído — contexto de loja dentro de uma ferramenta de gestão.

## Solução

Criar dois layouts distintos:

1. **`PublicLayout`** — envolve as rotas públicas, mantém exatamente o que existe hoje (PromoBanner + Header + Footer + CartSidebar + CartOverlay)
2. **`AdminLayout`** — envolve as rotas `/admin/*`, fornece um header limpo voltado para gestão, sem footer, sem carrinho, sem promo banner

O `AdminLayout` exibe:
- Logo com link para `/admin`
- Botão "← Ver loja" (link para `/`)
- Nome do usuário logado + botão Sair

## Escopo

### Frontend
- `frontend/src/components/layout/AdminLayout.tsx` — novo componente com header admin + `<Outlet />`
- `frontend/src/App.tsx` — refatora estrutura de rotas: rotas públicas dentro de `PublicLayout`, rotas admin dentro de `AdminLayout` (mantendo `ProtectedRoute` como guard de autenticação)

## Não-escopo

- Sidebar de navegação lateral no admin (pode ser uma evolução futura)
- Mudança nas páginas admin individuais (conteúdo interno permanece igual)
- Alteração no `ProtectedRoute` (continua responsável pela autenticação/autorização)
- Temas ou estilos específicos do admin além do header limpo
