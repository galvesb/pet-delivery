# Proposal: Redesign do Painel Administrativo com Sidebar

## Problema

O painel admin atual usa um layout simples com header top + conteúdo centralizado. A navegação entre seções depende de botões no Dashboard ou do botão "voltar" em cada página. Isso dificulta a navegação rápida entre seções e não transmite a sensação de um painel profissional.

## Solução

Redesenhar o AdminLayout para usar uma **sidebar fixa** com navegação permanente no desktop, e um **drawer (hamburger)** no mobile. Manter 100% do design system HomePet (cores, bordas, tipografia, sombras).

### Mudanças principais

1. **Sidebar fixa (desktop)** — Navegação lateral com logo, itens agrupados por seção (Principal, Catálogo, Conteúdo), e ações no rodapé (Ver loja, Sair)
2. **Drawer mobile (hamburger)** — No mobile, sidebar vira drawer com overlay escuro, ativado por ☰
3. **Dashboard redesenhado** — 3 cards de contagem (Produtos, Categorias, Marcas) + duas seções lado a lado:
   - **Últimos Agendamentos** (dados hardcoded) — lista de agendamentos de petshop/veterinário
   - **Agenda do Dia** (dados hardcoded) — cronograma do dia com horários
4. **Remoção dos botões de navegação** — Os botões "Gerenciar X" somem do Dashboard pois a sidebar já fornece essa navegação

## Escopo

- Refatorar `AdminLayout.tsx` com sidebar + conteúdo
- Criar CSS da sidebar no `global.css`
- Redesenhar `DashboardPage.tsx` com cards e seções de agendamento/agenda
- Responsividade: sidebar → drawer no mobile (< 768px)

## Não-escopo

- Backend de agendamentos (dados são hardcoded)
- Mudanças nas páginas internas do admin (Products, Categories, etc.)
- Mudanças no layout público (Header, Footer, etc.)
