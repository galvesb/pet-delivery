# Proposal: Controle de Quantidade no Carrinho + Estoque

## Problema

Hoje o carrinho só permite adicionar 1 unidade por vez (clicando repetidamente em "Add") e a única forma de diminuir é removendo o item inteiro. Não existe controle de estoque — qualquer quantidade pode ser adicionada.

## Solução

1. **Estoque no produto** — Admin define a quantidade em estoque ao cadastrar/editar um produto. Esse valor limita o máximo que o cliente pode adicionar ao carrinho.

2. **Controles de quantidade no carrinho** — Substituir o botão "Remover" por botões `[ - ] qty [ + ]` em cada item do carrinho.

3. **Comportamento do botão `-`** — Quando a quantidade chega a 1 e o usuário clica `-`, o item é removido do carrinho.

4. **Página de detalhe** — Mantém o comportamento atual (botão "Adicionar ao carrinho" adiciona +1).

## Escopo

- Backend: campo `stock` no modelo Product + schemas + validação
- Frontend: `updateQuantity` no cartStore, controles visuais no CartItem
- Frontend: campo "Estoque" no ProductForm (admin)
- Frontend: bloquear "Add" quando `stock <= 0` ou quantidade no carrinho = stock
