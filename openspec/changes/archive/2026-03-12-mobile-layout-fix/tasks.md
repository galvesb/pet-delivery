# Tasks: Correções de Layout Mobile

## Header

- [x] Remover inline style do `<header>` em `frontend/src/components/layout/Header.tsx` (manter apenas `className="container"`)
- [x] Corrigir padding do seletor `header` em `frontend/src/styles/global.css` para incluir padding lateral (20px)

## Hero responsivo

- [x] Adicionar regras mobile para `.hero-img-box` (largura relativa, max-width 300px, aspect-ratio) no media query 768px
- [x] Reposicionar `.price-tag` no mobile (left: 0, bottom ajustado)
- [x] Reduzir `.hero-title` para 28px no mobile

## Tipografia mobile

- [x] Reduzir tamanho de `h2` das seções da home para 24px no media query 768px

## Padding lateral em todas as seções

- [x] Corrigir `padding: Xpx 0` → `padding: Xpx 20px` em todas as seções que sobrescreviam o `.container` (`.hero`, `.services`, `.products`, `.products-page`, `.featured-products`, `.how-it-works`, `.testimonials`, `.brand-partners`, `.contact-section`, `footer`)

## Price tag no mobile

- [x] Centralizar `.price-tag` no mobile com `left: 50%; transform: translateX(-50%)` para não ficar cortado
- [x] Aumentar `.price-tag` no mobile: `padding: 10px 28px`, `white-space: nowrap`, `bottom: -24px`

## Entrar/Sair no menu hamburguer

- [x] Adicionar "Entrar" e "Sair" como itens de link normais (sem botão) no `.nav-links`, visíveis apenas no mobile (`.nav-auth-item`)
- [x] Corrigir bug: remover `.header-actions > div { display: none; }` que escondia hamburguer e carrinho; usar `.header-user-info { display: none; }` no mobile

## Ícone do carrinho SVG

- [x] Substituir emoji 🛍️ por SVG de shopping bag (stroke, igual referência visual com badge vermelho)
- [x] Ajustar `.cart-icon` CSS: remover `font-size: 28px`, usar `color: var(--dark)` para o SVG herdar

## Fechar menu ao clicar fora

- [x] Adicionar `useRef` para `nav` e `menu-toggle`, `useEffect` com `mousedown` listener que fecha o menu ao clicar fora de ambos

## Badge do carrinho cortado no topo

- [x] Aumentar padding-top do header mobile de 20px para 28px para dar espaço ao badge `top: -8px`

## Grids em telas pequenas

- [x] Adicionar media query 480px com `.featured-products-grid` e `.product-grid` em 1 coluna

## Adições durante implementação

- [x] Ajustar posição do cart-count badge no mobile (top: -2px, tamanho 18x18) para evitar clipping
- [x] Adicionar padding nos wrappers de `/login` e `/register` para margem lateral mobile
- [x] Remover nome do usuário do header público e admin
- [x] Fixar especificidade CSS do header para não ser sobrescrita por `.container`
- [x] Adicionar `border-bottom` full-width ao header (separar header do conteúdo com `.header-inner`)
- [x] Implementar `PublicLayout` e `AdminLayout` para separar shell do painel admin (sem PromoBanner, Footer, Cart)
- [x] Tornar tabela de produtos do admin responsiva com `overflow-x: auto` e ocultação de coluna mobile
