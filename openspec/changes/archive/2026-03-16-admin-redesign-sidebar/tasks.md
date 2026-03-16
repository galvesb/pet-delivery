# Tasks: Redesign do Painel Administrativo com Sidebar

## AdminLayout — Sidebar + Conteúdo

- [x] Reescrever `AdminLayout.tsx` com estrutura: `admin-layout` > `admin-sidebar` + `admin-content`
- [x] Adicionar sidebar com logo, nav agrupado (Principal/Catálogo/Conteúdo), e footer (Ver loja, Sair)
- [x] Usar `NavLink` do React Router para itens do menu (classe `.active` automática)
- [x] Adicionar estado `sidebarOpen` + toggle no ☰ para mobile
- [x] Adicionar overlay escuro que fecha sidebar ao clicar fora (mobile)
- [x] Adicionar topbar mobile (☰ + Sair) visível apenas em telas < 768px

## CSS da Sidebar

- [x] Substituir estilos `.admin-header`, `.admin-header-actions`, `.admin-logo`, `.admin-username` pelos novos estilos de sidebar
- [x] Adicionar `.admin-layout` (flex, min-height 100vh)
- [x] Adicionar `.admin-sidebar` (fixed, 240px, border-right, flex column)
- [x] Adicionar `.admin-nav-group`, `.admin-nav-label` (uppercase, gray, 11px)
- [x] Adicionar `.admin-nav-link` (padding, hover, `.active` com light-red bg e red left-border)
- [x] Adicionar `.admin-sidebar-footer` (border-top, links Ver loja/Sair)
- [x] Adicionar `.admin-content` (margin-left: 240px)
- [x] Adicionar `.admin-topbar` (display none desktop, flex no mobile com sticky top)
- [x] Adicionar `.admin-overlay` (fixed, rgba overlay, z-index)
- [x] Adicionar media query 768px: sidebar translateX(-100%), .open translateX(0), content margin-left 0

## DashboardPage — Redesign

- [x] Adicionar contagem de marcas à chamada API (além de produtos e categorias)
- [x] Redesenhar cards de contagem: 3 colunas (Produtos, Categorias, Marcas) com grid `repeat(3, 1fr)`
- [x] Remover grid de botões "Gerenciar X" e "← Ver loja" (navegação agora na sidebar)
- [x] Adicionar seção "Últimos Agendamentos" com dados hardcoded (5 agendamentos pet/vet)
- [x] Adicionar seção "Hoje, 12 Mar" com dados hardcoded (3 horários do dia)
- [x] Layout 2 colunas para agendamentos + agenda (grid 1fr 1fr, mobile 1 coluna)
- [x] Estilizar cards de agendamento com `border: var(--border-thick)`, `border-radius: var(--border-radius)`
