# Tasks: Persistência do Carrinho

## cartStore — Persist middleware

- [x] Importar `persist` de `zustand/middleware` no `cartStore.ts`
- [x] Envolver o store com `persist`, usando `name: "cart-storage"` e `partialize` que persiste apenas `items`

## useCart — Hidratação no login

- [x] Adicionar `useEffect` no `useCart.ts` que observa mudanças no `user`
- [x] Quando `user` muda para logado: buscar `GET /cart` do servidor
- [x] Implementar lógica de merge: se local vazio e servidor tem itens, usar servidor; se local tem itens, manter local e sync pro servidor via `PATCH /cart`

## Verificação

- [x] Testar: adicionar itens, F5, itens permanecem (localStorage)
- [x] Testar: login com carrinho vazio local + carrinho no servidor → carrega do servidor
- [x] Testar: login com carrinho local cheio → mantém local, sincroniza servidor
