# Tasks: Upload de Imagens e Detalhe do Produto

## Fase 1: Backend — Upload de Imagens

- [x] Adicionar `Pillow>=10.0` ao `requirements.txt` e ao `pyproject.toml`
- [x] Criar diretório `backend/uploads/products/` com `.gitkeep`
- [x] Criar `backend/app/services/upload_service.py` — processar imagens (validate, resize 1200x1200, convert webp quality 85, save com UUID)
- [x] Criar `backend/app/api/v1/endpoints/uploads.py` — `POST /uploads/images` (multipart, max 10 arquivos, ADMIN only)
- [x] Registrar router de uploads no `backend/app/api/v1/router.py`
- [x] Montar `StaticFiles` em `/uploads` no `backend/app/main.py` (para servir em dev)

## Fase 2: Backend — Model e Schemas do Produto

- [x] Alterar `backend/app/models/product.py` — `image_url: str` → `image_urls: List[str]` + `cover_index: int = 0`
- [x] Alterar `backend/app/schemas/product.py` — `ProductCreate`: `image_urls` (min 1, max 10), `cover_index`, description max 2000; `ProductResponse`: adicionar `cover_url` computed; remover validação de URL http
- [x] Alterar `backend/app/services/product_service.py` — adaptar `create_product`, `update_product` e `_to_response` para `image_urls` + `cover_index` + `cover_url`
- [x] Alterar `backend/app/models/user.py` — `CartItem.image_url` continua string (usa `cover_url` do produto)
- [x] Alterar `backend/app/services/cart_service.py` — ao sincronizar carrinho, popular `image_url` com `cover_url` do produto

## Fase 3: Infraestrutura Docker

- [x] Alterar `docker-compose.yml` — adicionar volume `uploads_data`, montar em `/app/uploads` no serviço `api`
- [x] Alterar `frontend/nginx.conf` — adicionar `location /uploads/` servindo do volume (para produção)
- [x] Adicionar `uploads/` ao `.gitignore`
- [x] Alterar `docker-compose.yml` produção — montar `uploads_data` read-only no serviço `frontend` (nginx)

## Fase 4: Frontend — Componente ImageUploader

- [x] Criar `frontend/src/components/admin/ImageUploader.tsx` — input file multiple, upload via POST /uploads/images, preview com loading, botão remover (✕), botão capa (⭐), drag-and-drop nativo para reordenar, limite de 10
- [x] Alterar `frontend/src/components/admin/ProductForm.tsx` — trocar input URL por ImageUploader, trocar input descrição por textarea (4 rows), reordenar campos (nome → descrição → preço → fotos → categorias), adaptar para `image_urls` + `cover_index`

## Fase 5: Frontend — Página de Detalhe do Produto

- [x] Criar `frontend/src/components/products/ProductGallery.tsx` — foto principal grande + thumbnails clicáveis embaixo
- [x] Criar `frontend/src/pages/ProductDetailPage.tsx` — fetch GET /products/:id, layout 2 colunas (galeria + info), botão adicionar ao carrinho, link voltar, loading/error states, responsivo (stack no mobile)
- [x] Alterar `frontend/src/App.tsx` — adicionar rota `/produto/:id` → ProductDetailPage
- [x] Alterar `frontend/src/components/products/ProductCard.tsx` — clicar no card navega para `/produto/:id` (exceto botão Add); usar `cover_url` em vez de `image_url`

## Fase 6: Frontend — Tipos e Ajustes Gerais

- [x] Alterar `frontend/src/types/index.ts` — Product: `image_url` → `image_urls: string[]` + `cover_index: number` + `cover_url: string`
- [x] Alterar `frontend/src/components/cart/CartItem.tsx` — garantir que usa `image_url` do CartItem (sem quebrar)
- [x] Alterar `frontend/src/hooks/useCart.ts` — ao adicionar item, usar `cover_url` do produto como `image_url` do CartItem
- [x] Alterar CSS em `frontend/src/styles/global.css` — estilos para galeria, thumbnails, textarea descrição, image uploader

## Fase 7: Verificação Final

- [x] Verificar fluxo completo: upload fotos → criar produto → ver na vitrine → clicar → detalhe com galeria → add ao carrinho
- [x] Verificar edição: abrir produto existente → adicionar/remover fotos → trocar capa → salvar
- [x] Verificar responsividade mobile da página de detalhe
- [x] Verificar que uploads persistem entre restarts do container (volume Docker)
