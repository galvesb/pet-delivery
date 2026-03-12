# Design: Controle de Quantidade no Carrinho + Estoque

## Backend

### Product Model
- Adicionar `stock: int = Field(default=0, ge=0)` ao modelo Product

### Product Schemas
- `ProductCreate`: + `stock: int` (ge=0)
- `ProductUpdate`: + `stock: Optional[int]` (ge=0)
- `ProductResponse`: + `stock: int`

### Validação
- Não há validação de estoque no backend do carrinho neste momento (carrinho é client-side com sync simples). A validação de estoque será feita no frontend ao adicionar/atualizar quantidade.

## Frontend

### Types
- `Product` interface: + `stock: number`
- `CartItem` interface: + `stock: number` (para saber o limite no carrinho)

### cartStore (Zustand)
- Novo método: `updateQuantity(product_id: string, quantity: number)`
  - Se `quantity <= 0`: remove o item
  - Se `quantity > item.stock`: limita ao stock
  - Caso contrário: atualiza a quantidade
- Modificar `addItem`: incluir `stock` no CartItem, bloquear se `quantity >= stock`

### useCart Hook
- Expor `updateQuantity` com sync ao servidor (já tem debounce)

### CartItem Component
- Substituir botão "Remover" por:
  ```
  [ - ]  {quantity}  [ + ]
  ```
- Botão `+` desabilitado quando `quantity >= stock`
- Botão `-` quando `quantity === 1`: remove o item do carrinho
- Mostrar preço unitário + subtotal

### ProductForm (Admin)
- Adicionar campo input numérico "Quantidade em estoque" entre Preço e Fotos
- Incluir `stock` no submit data

### ProductCard + ProductDetailPage
- Desabilitar botão "Add" / "Adicionar ao carrinho" quando `product.stock <= 0`
- Mostrar "Esgotado" quando `stock === 0`
- Se item já está no carrinho com `quantity === stock`, desabilitar o botão

## Fluxo Visual

```
Admin cadastra produto         Cliente adiciona ao carrinho
com stock: 15
                               [ - ]  3  [ + ]    ← + habilitado (3 < 15)
                               [ - ] 15  [ + ]    ← + desabilitado (15 = 15)
                               [ - ]  1  [ - ]    ← clica - → remove item
```
