# Spec: Carrinho Híbrido

## Descrição
Carrinho que funciona localmente para visitantes (Zustand) e sincroniza com o servidor para usuários logados. Armazenado como subdocumento no User.

## Modelo: CartItem (subdocumento do User)
| Campo | Tipo | Regras |
|-------|------|--------|
| product_id | str | ObjectId do produto |
| name | str | Nome do produto (snapshot) |
| price | float | Preço no momento da adição (snapshot) |
| image_url | str | URL da imagem (snapshot) |
| quantity | int | >= 1 |

## Comportamento no frontend (Zustand cartStore)

### Visitante (sem auth)
- `addItem(product)`: se product_id existe, incrementa quantity; senão, adiciona
- `removeItem(product_id)`: remove do array
- `clearCart()`: limpa array
- `getTotal()`: soma price * quantity
- Estado persiste apenas em memória (perde ao fechar aba)

### Logado (com auth)
- Mesmo comportamento local do visitante
- Após cada mutação: **debounce 500ms** → `PATCH /api/v1/cart` com array completo
- Garante sync sem spammar a API

### Fluxo de login (merge)
1. Login retorna access token
2. Frontend faz `GET /api/v1/cart` (carrinho do servidor)
3. Merge: itens locais + itens do servidor
   - Mesmo `product_id` → soma quantities
   - Itens únicos → mantém
4. `PATCH /api/v1/cart` com resultado do merge
5. Zustand cartStore recebe array mergeado

### Fluxo de logout
- Zustand cartStore é limpo
- Carrinho do servidor permanece intacto para próximo login

## Endpoints (autenticado)

### GET /api/v1/cart
- Retorna `User.cart` do usuário logado
- Response: `{ items: CartItem[], total: float }`

### PATCH /api/v1/cart
- Body: `{ items: CartItemSchema[] }` (array completo — substituição total)
- Valida que cada `product_id` referencia um Product existente e ativo
- Atualiza `User.cart` com o array recebido
- Response: `{ items: CartItem[], total: float }`

### DELETE /api/v1/cart
- Limpa `User.cart` (seta para array vazio)
- Response: 204
