# Design: Correções na Seção Produtos em Destaque

## Arquivo afetado

`frontend/src/components/home/FeaturedProducts.tsx` — único arquivo a modificar.

## 1. Remover botão "Ver todos os produtos"

Remover o bloco completo (linhas 44–46):

```tsx
// REMOVER:
<div className="featured-products-footer">
  <Link to="/products" className="btn">Ver todos os produtos</Link>
</div>
```

O import `Link` permanece — ainda é usado nos links dos cards individuais.

## 2. Adicionar badge de desconto sobre a imagem

O container do link da imagem precisa de `position: relative` para o badge ser posicionado absolutamente sobre ela. Adicionar `style={{ position: "relative" }}` no `<Link className="featured-product-img-link">`.

Renderizar o badge condicionalmente após o `<img>`:

```tsx
{product.discount_price && (
  <span className="discount-badge">
    -{Math.round((1 - product.effective_price / product.price) * 100)}%
  </span>
)}
```

A classe `.discount-badge` já existe no `global.css` com posicionamento absoluto, cor e tipografia corretos.

## 3. Substituir exibição de preço

**Atual:**
```tsx
<p className="featured-product-price">
  R$ {product.price.toFixed(2).replace(".", ",")}
</p>
```

**Novo:**
```tsx
<div className="product-price-group">
  {product.discount_price ? (
    <>
      <span className="product-price-original">
        R$ {product.price.toFixed(2).replace(".", ",")}
      </span>
      <span className="featured-product-price">
        R$ {product.effective_price.toFixed(2).replace(".", ",")}
      </span>
    </>
  ) : (
    <span className="featured-product-price">
      R$ {product.price.toFixed(2).replace(".", ",")}
    </span>
  )}
</div>
```

Classes reutilizadas do `global.css`:
- `.product-price-group` — flex container para alinhar preços
- `.product-price-original` — `text-decoration: line-through`, cor atenuada

## Resultado visual

```
Sem desconto:
┌──────────────────────────┐
│  [imagem]                │
│  Nome do Produto         │
│  R$ 89,90                │
│  [Ver produto]           │
└──────────────────────────┘

Com desconto:
┌──────────────────────────┐
│  [imagem]  [-25%]        │  ← badge sobre imagem
│  Nome do Produto         │
│  ~~R$ 89,90~~  R$ 67,00  │  ← original riscado + efetivo
│  [Ver produto]           │
└──────────────────────────┘
```
