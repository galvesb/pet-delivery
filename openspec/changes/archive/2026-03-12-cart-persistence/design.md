# Design: Persistência do Carrinho

## cartStore (`frontend/src/store/cartStore.ts`)

### Persist middleware
- Envolver o `create` com `persist` do `zustand/middleware`
- `name: "cart-storage"` (chave no localStorage)
- `partialize`: persistir apenas `items` — excluir `isOpen` e métodos
- O middleware cuida de salvar/restaurar automaticamente

```
create(
  persist(
    (set, get) => ({ ... }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
)
```

## useCart Hook (`frontend/src/hooks/useCart.ts`)

### Hidratação no login
- Adicionar `useEffect` que observa `user`
- Quando `user` muda de `null` para logado:
  1. `GET /cart` → `serverItems`
  2. `localItems = cartStore.items` (já reidratado pelo persist)
  3. Se `localItems.length === 0` e `serverItems.length > 0` → `setItems(serverItems)`
  4. Se `localItems.length > 0` → mantém local, faz `PATCH /cart` para sincronizar servidor

### Limpeza no logout
- O `clearCart` existente já limpa o store
- O persist middleware automaticamente atualiza o localStorage quando items muda
- Não precisa de limpeza manual do localStorage

## Fluxo

```
┌─────────────────────────────────────────┐
│  App carrega / F5                        │
│                                         │
│  persist reidrata items do localStorage │
│  → carrinho preservado ✓                │
│                                         │
│  Se user logado:                        │
│    GET /cart → serverItems              │
│    local vazio? → usa server            │
│    local cheio? → mantém + sync server  │
└─────────────────────────────────────────┘
```

## Arquivos afetados

- `frontend/src/store/cartStore.ts` — adicionar persist middleware
- `frontend/src/hooks/useCart.ts` — adicionar hidratação no login
