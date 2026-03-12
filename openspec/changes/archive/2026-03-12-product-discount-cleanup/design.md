# Design: Desconto em Produtos + Limpeza da Listagem

## Backend

### Product Model (`backend/app/models/product.py`)
- Adicionar `discount_price: Optional[float] = None`
- Quando `None` → produto sem desconto

### Product Schemas (`backend/app/schemas/product.py`)
- `ProductCreate`: + `discount_price: Optional[float] = Field(None, gt=0)`
  - Validator: se informado, deve ser < `price`
- `ProductUpdate`: + `discount_price: Optional[float] = Field(None, gt=0)`
  - Aceita `0` ou `None` para remover desconto
- `ProductResponse`: + `discount_price: Optional[float]` + `effective_price: float`
  - `effective_price` = `discount_price` se existir, senão `price`

### Product Service (`backend/app/services/product_service.py`)
- `_to_response()` calcula `effective_price` ao montar o response

### Cart Service (`backend/app/services/cart_service.py`)
- `sync_cart()` busca cada produto do banco e usa `effective_price` no retorno
- Não confia mais no `price` enviado pelo frontend
- Retorna items com preços atualizados para o frontend sincronizar

### Cart Schemas (`backend/app/schemas/cart.py`)
- `CartItemSchema`: + `original_price: Optional[float] = None` (para exibir riscado)

## Frontend

### Types (`frontend/src/types/index.ts`)
- `Product` interface: + `discount_price: number | null` + `effective_price: number`
- `CartItem` interface: + `original_price: number | null` (preço antes do desconto)

### ProductCard (`frontend/src/components/products/ProductCard.tsx`)
- Remover `<p>{product.description}</p>`
- Se `discount_price` existe:
  - Mostrar `price` riscado (text-decoration: line-through, cor cinza)
  - Mostrar `effective_price` como preço principal
  - Badge com `-%` sobre a imagem (canto superior esquerdo)
- Botão "Add" usa `effective_price` implicitamente (via addItem)

### ProductDetailPage (`frontend/src/pages/ProductDetailPage.tsx`)
- Se `discount_price` existe:
  - Preço original riscado
  - Preço com desconto em destaque
  - Badge: "Voce economiza R$ {diferença} ({percentual}%)"
- Se não tem desconto, mantém exibição atual

### CartItem (`frontend/src/components/cart/CartItem.tsx`)
- Se `original_price` existe e difere de `price`:
  - Mostrar `original_price` riscado + `price` (effective) como preço unitário
- Subtotal usa `price * quantity` (que já é o effective)

### cartStore (`frontend/src/store/cartStore.ts`)
- `addItem`: usar `product.effective_price` como `price` do CartItem
- `addItem`: guardar `product.price` como `original_price` se houver desconto

### ProductForm Admin (`frontend/src/components/admin/ProductForm.tsx`)
- Novo campo "Preço com desconto" (input numérico, opcional)
- Posição: entre Preço e Estoque
- Validação no submit: se preenchido, deve ser < preço
- Ao editar produto existente, preenche com `discount_price` atual

### useCart Hook (`frontend/src/hooks/useCart.ts`)
- Sem mudanças estruturais — já faz sync com server

## Fluxo Visual

```
Admin cadastra produto:
  Preço: R$ 10,00
  Desconto: R$ 7,50        ← campo opcional

Card na listagem:
  ┌─────────────────────┐
  │ ┌──────┐  [imagem]  │
  │ │ -25% │            │
  │ └──────┘            │
  ├─────────────────────┤
  │  Nome do Produto     │
  │  R̶$̶ ̶1̶0̶,̶0̶0̶            │
  │  R$ 7,50     [+Add]  │
  └─────────────────────┘

Detalhe do produto:
  R̶$̶ ̶1̶0̶,̶0̶0̶
  R$ 7,50
  🏷️ Você economiza R$ 2,50 (25%)

Carrinho:
  [img]  Produto           ✕
         R̶$̶ ̶1̶0̶,̶0̶0̶  R$ 7,50 / un.
         [−] 2 [+]     R$ 15,00
```
