# Tasks: Desconto em Produtos + Limpeza da Listagem

## Backend — Modelo e Schemas

- [x] Adicionar `discount_price: Optional[float] = None` ao modelo `Product` em `backend/app/models/product.py`
- [x] Adicionar `discount_price: Optional[float] = Field(None, gt=0)` ao `ProductCreate` com validator que garante `discount_price < price`
- [x] Adicionar `discount_price` ao `ProductUpdate` (aceita `None` para remover desconto)
- [x] Adicionar `discount_price: Optional[float]` e `effective_price: float` ao `ProductResponse`
- [x] Atualizar `_to_response()` em `product_service.py` para calcular `effective_price = discount_price or price`

## Backend — Carrinho com preços atualizados

- [x] Adicionar `original_price: Optional[float] = None` ao `CartItemSchema` em `backend/app/schemas/cart.py`
- [x] Modificar `sync_cart()` em `cart_service.py` para buscar o produto real e usar `effective_price` no retorno (não confiar no preço do frontend)

## Frontend — Types

- [x] Adicionar `discount_price: number | null` e `effective_price: number` à interface `Product` em `types/index.ts`
- [x] Adicionar `original_price: number | null` à interface `CartItem` em `types/index.ts`

## Frontend — Remover descrição da listagem

- [x] Remover `<p>{product.description}</p>` do `ProductCard.tsx`

## Frontend — Exibição de desconto no ProductCard

- [x] Mostrar preço original riscado + effective_price quando `discount_price` existir
- [x] Adicionar badge com percentual de desconto (ex: "-25%") sobre a imagem do produto

## Frontend — Exibição de desconto no ProductDetailPage

- [x] Mostrar preço original riscado + effective_price quando `discount_price` existir
- [x] Adicionar badge de economia: "Você economiza R$ X (Y%)"

## Frontend — Exibição de desconto no CartItem

- [x] Mostrar `original_price` riscado ao lado do effective_price quando houver desconto

## Frontend — Cart Store

- [x] Modificar `addItem` no `cartStore.ts` para usar `product.effective_price` como `price` e guardar `product.price` como `original_price` se houver desconto

## Frontend — Admin ProductForm

- [x] Adicionar campo "Preço com desconto" (opcional) ao `ProductForm.tsx` entre Preço e Estoque
- [x] Validação no frontend: se preenchido, deve ser menor que o preço original
- [x] Ao editar, preencher campo com `discount_price` existente do produto

## Frontend — CSS

- [x] Estilizar preço riscado (text-decoration: line-through, cor cinza) nos componentes ProductCard, ProductDetailPage e CartItem
- [x] Estilizar badge de desconto (posição absoluta sobre a imagem no card, fundo vermelho/destaque)
- [x] Estilizar badge de economia na página de detalhe
