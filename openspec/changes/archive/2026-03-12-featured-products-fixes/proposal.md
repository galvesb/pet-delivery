# Proposal: Correções na Seção Produtos em Destaque

## Problema

A seção "Produtos em Destaque" na home tem dois problemas:

1. **Botão desnecessário**: Exibe um botão "Ver todos os produtos" no rodapé da seção que não agrega valor — o usuário já tem acesso à listagem pelo menu de navegação.

2. **Desconto não exibido**: Quando um produto em destaque tem `discount_price`, o componente ignora esse campo e exibe apenas `product.price`. O preço riscado, o preço com desconto e o badge percentual não aparecem, diferente do comportamento correto já implementado no `ProductCard` da listagem.

## Solução

### 1. Remover botão "Ver todos os produtos"
Remover o bloco `featured-products-footer` com o link de navegação para `/products`.

### 2. Exibir desconto inline (opção B)
Manter o layout customizado do card em destaque, mas replicar a lógica de desconto do `ProductCard`:
- Badge `-X%` posicionado sobre a imagem quando há desconto
- Preço original riscado + `effective_price` quando `discount_price` existe
- Somente `price` quando não há desconto

## Escopo

- Somente `frontend/src/components/home/FeaturedProducts.tsx`
- Reutiliza classes CSS já existentes (`.product-price-original`, `.discount-badge`)
- Sem alterações no backend ou em outros componentes

## Não-escopo

- Refatorar para reutilizar o `ProductCard` (decidido manter layout customizado)
- Alterações em CSS (classes já existem)
- Adicionar botão "Adicionar ao carrinho" nos cards em destaque
