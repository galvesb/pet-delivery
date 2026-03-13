# Proposal: Correções de Layout Mobile

## Problema

O site está sem margens laterais no mobile. O conteúdo cola nas bordas da tela, especialmente o header, e alguns elementos (hero image, price tag) podem estourar a viewport em telas pequenas.

**Causa raiz principal:** o `Header.tsx` aplica `style={{ padding: "40px 0 20px" }}` inline, que sobrescreve o `padding: 0 20px` do `.container`, zerando o padding lateral.

**Problemas secundários:**
- `.hero-img-box` com largura fixa de 350px — estoura em telas < 375px
- `.price-tag` com `left: -40px` — sai da viewport no mobile
- Fontes grandes (`.hero-title: 48px`, `h2: 36px`) sem redução no mobile
- Grids de 2 colunas podem ser apertados em telas de 320-375px

## Solução

1. **Corrigir o Header** — remover o inline style que sobrescreve o padding do `.container`, mover estilos para o CSS
2. **Tornar o Hero responsivo** — `.hero-img-box` com largura relativa, `.price-tag` reposicionado no mobile
3. **Ajustar tipografia mobile** — reduzir fontes de títulos em telas pequenas
4. **Garantir grids mobile** — 1 coluna para grids de produtos em telas < 480px

## Escopo

Apenas CSS e remoção do inline style do Header. Sem mudanças de lógica ou funcionalidade.

## Não-escopo

- Redesign do layout mobile (apenas corrigir o que está quebrando)
- Menu hamburger aprimorado (funciona, só precisa dos paddings)
- Páginas admin (layout separado, escopo diferente)
