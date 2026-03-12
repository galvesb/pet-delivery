# Proposal: Desconto em Produtos + Limpeza da Listagem

## Problema

1. **Listagem poluída** — O card de produto na listagem exibe a descrição, ocupando espaço desnecessário. A descrição só faz sentido na página de detalhe.

2. **Sem suporte a descontos** — O admin não tem como aplicar desconto em um produto. Não há forma de mostrar "de R$ 10,00 por R$ 7,50" ao cliente.

3. **Preços desatualizados no carrinho** — Se o admin altera o preço de um produto, o carrinho mantém o preço antigo até o próximo login.

## Solução

### 1. Remover descrição da listagem
Remover `<p>{product.description}</p>` do ProductCard. A descrição continua visível na ProductDetailPage.

### 2. Campo de desconto no produto
- Novo campo `discount_price` (opcional) no modelo Product
- Admin define o valor com desconto no ProductForm
- Validação: `discount_price` deve ser menor que `price` (front + back)
- Backend expõe `effective_price = discount_price ?? price` no response

### 3. Exibição de preços com desconto
- **Card (listagem):** preço original riscado + preço novo + badge com % de desconto na imagem
- **Detalhe:** preço riscado + preço novo + badge "Você economiza R$ X (Y%)"
- **Carrinho:** preço original riscado + effective_price por unidade

### 4. Carrinho usa preço atualizado
- O `addItem` passa `effective_price` para o CartItem
- O sync do carrinho (`PATCH /cart`) atualiza preços a partir do banco, não confiando no frontend

## Escopo

- Backend: `discount_price` no modelo + schemas + validação + `effective_price` computado
- Backend: `sync_cart` busca preços reais dos produtos
- Frontend: remover descrição do ProductCard
- Frontend: campo "Preço com desconto" no ProductForm (admin)
- Frontend: exibição de preço riscado + economia no ProductCard, ProductDetailPage, CartItem
- Frontend: `addItem` usa `effective_price`

## Não-escopo

- Descontos por categoria ou por período (promoções temporárias)
- Cupons de desconto
- Histórico de preços
