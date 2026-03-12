# Tasks: Controle de Quantidade no Carrinho + Estoque

## Backend

- [x] Adicionar campo `stock: int = Field(default=0, ge=0)` ao modelo `Product` em `backend/app/models/product.py`
- [x] Adicionar `stock: int` (ge=0) ao `ProductCreate` e `stock: Optional[int]` (ge=0) ao `ProductUpdate` em `backend/app/schemas/product.py`
- [x] Adicionar `stock: int` ao `ProductResponse` em `backend/app/schemas/product.py`

## Frontend — Types

- [x] Adicionar `stock: number` à interface `Product` em `frontend/src/types/index.ts`
- [x] Adicionar `stock: number` à interface `CartItem` em `frontend/src/types/index.ts`

## Frontend — Cart Store + Hook

- [x] Modificar `addItem` no `cartStore.ts` para incluir `stock` no CartItem e bloquear se `quantity >= stock`
- [x] Adicionar método `updateQuantity(product_id: string, delta: number)` ao `cartStore.ts` — se nova qty <= 0 remove o item, se nova qty > stock limita ao stock
- [x] Expor `updateQuantity` no hook `useCart.ts` com sync ao servidor

## Frontend — CartItem Component

- [x] Substituir botão "Remover" por controles `[ - ] qty [ + ]` no `CartItem.tsx`
- [x] Desabilitar botão `+` quando `quantity >= stock`
- [x] Mostrar preço unitário e subtotal separadamente
- [x] Estilizar os botões de quantidade no CSS (classe `.cart-qty-controls`)

## Frontend — Admin ProductForm

- [x] Adicionar campo input numérico "Quantidade em estoque" ao `ProductForm.tsx` (entre Preço e Fotos)
- [x] Incluir `stock` no estado e no submit data do formulário

## Frontend — ProductCard + ProductDetailPage

- [x] Desabilitar botão "Add" no `ProductCard.tsx` quando `product.stock <= 0`, mostrando "Esgotado"
- [x] Desabilitar botão "Adicionar ao carrinho" no `ProductDetailPage.tsx` quando `product.stock <= 0`, mostrando "Esgotado"
