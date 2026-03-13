# Design: Correções de Layout Mobile

## 1. Header — Remover inline style

### `frontend/src/components/layout/Header.tsx` (alterado)

**Antes:**
```tsx
<header className="container" style={{ padding: "40px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
```

**Depois:**
```tsx
<header className="container">
```

Os estilos de `display`, `justify-content` e `align-items` já existem no CSS do `header` (linha 71-76 do global.css). O `padding: 40px 0 20px` será mantido no CSS, mas corrigido para preservar o padding lateral do `.container`.

### `frontend/src/styles/global.css` (alterado)

**Antes:**
```css
header {
    padding: 40px 0 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

**Depois:**
```css
header {
    padding: 40px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

Nota: como o header também tem classe `.container` (que já dá `padding: 0 20px`), e o CSS de `header` é mais específico por estar depois, precisamos garantir que o padding lateral não seja sobrescrito. A solução é incluir o 20px lateral no próprio seletor `header`.

---

## 2. Hero responsivo

### `frontend/src/styles/global.css` — media query 768px (alterado)

Adicionar ao bloco `@media (max-width: 768px)`:

```css
.hero-img-box {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 7/8;
}
.price-tag {
    left: 0;
    bottom: -10px;
}
.hero-title {
    font-size: 28px;
}
```

---

## 3. Tipografia mobile

### `frontend/src/styles/global.css` — media query 768px (alterado)

Adicionar:
```css
.services h2,
.featured-products h2,
.how-it-works h2,
.testimonials h2,
.contact-section h2 {
    font-size: 24px;
}
```

---

## 4. Grids em telas muito pequenas

### `frontend/src/styles/global.css` — novo media query 480px

```css
@media (max-width: 480px) {
    .featured-products-grid {
        grid-template-columns: 1fr;
    }
    .product-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## Impacto visual esperado

```
ANTES (mobile 375px):                DEPOIS (mobile 375px):
┌───────────────────────┐            ┌───────────────────────┐
│Logo        🛒 Entrar  │ ← colado   │ Logo      🛒 Entrar  │ ← com margem
│Encontre tudo para...  │            │ Encontre tudo para.. │
│[img 350px estoura]    │            │ [img 100% max-300]   │
│                       │            │                      │
│🏷️← fora da tela      │            │ 🏷️ Ração Premium     │
└───────────────────────┘            └───────────────────────┘
```
