# Tasks: Correções na Seção Produtos em Destaque

## FeaturedProducts — Remover botão

- [x] Remover o bloco `<div className="featured-products-footer">` com o link "Ver todos os produtos" de `FeaturedProducts.tsx`

## FeaturedProducts — Exibir desconto

- [x] Adicionar `style={{ position: "relative" }}` no `<Link className="featured-product-img-link">` para suportar o badge absoluto
- [x] Renderizar badge `<span className="discount-badge">-X%</span>` condicionalmente quando `product.discount_price` existir
- [x] Substituir `<p className="featured-product-price">` pela lógica condicional: preço riscado + `effective_price` quando há desconto, só `price` quando não há
