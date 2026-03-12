# Tasks: Layout Separado para o Painel Admin

## Novos Componentes de Layout

- [x] Criar `frontend/src/components/layout/AdminLayout.tsx` com header admin (logo link `/admin`, botão "Ver loja" → `/`, nome do usuário, botão Sair)
- [x] Criar `frontend/src/components/layout/PublicLayout.tsx` movendo PromoBanner, Header, Footer, CartOverlay, CartSidebar para dentro do Outlet

## CSS do AdminLayout

- [x] Adicionar estilos `.admin-header`, `.admin-logo`, `.admin-header-actions`, `.admin-username` em `frontend/src/styles/global.css`

## Refatoração do App.tsx

- [x] Substituir shell global (`PromoBanner`, `Header`, `Footer`, etc.) por `<Route element={<PublicLayout />}>` envolvendo as rotas públicas
- [x] Aninhar `<Route element={<AdminLayout />}>` dentro do `<ProtectedRoute requiredRole="ADMIN">` envolvendo todas as rotas `/admin/*`
- [x] Remover imports não mais usados diretamente no `App.tsx` (Header, Footer, PromoBanner, CartSidebar, CartOverlay)
