# Design: Upload de Imagens e Detalhe do Produto

## Visão Geral da Arquitetura

```
Frontend (Admin)                    Backend                         Storage
┌──────────────┐                   ┌──────────────────┐            ┌────────────┐
│ ProductForm  │  POST /uploads/   │ uploads endpoint │  Pillow    │  /uploads/ │
│ (drag&drop)  │ ─────────────────►│ validate + resize│ ──────────►│  products/ │
│              │  multipart        │ convert to webp  │  save      │  {uuid}.webp│
│              │◄─────────────────│ return urls      │            └────────────┘
│              │  { urls: [...] }  └──────────────────┘                  │
│              │                                                         │
│              │  POST /products   ┌──────────────────┐            Nginx serves
│              │ ─────────────────►│ product endpoint │            /uploads/*
│              │  { image_urls }   │ save to MongoDB  │            as static
└──────────────┘                   └──────────────────┘

Frontend (Public)
┌──────────────┐                   ┌──────────────────┐
│ ProductCard  │  click            │ ProductDetail    │
│ (vitrine)    │ ─────────────────►│ /produto/:id     │
│ mostra capa  │                   │ galeria + info   │
└──────────────┘                   └──────────────────┘
```

## Backend

### Novo endpoint: Upload de Imagens

```
POST /api/v1/uploads/images
Auth: ADMIN
Content-Type: multipart/form-data
Body: files (múltiplos arquivos de imagem)

Validações:
- Content-type deve ser image/* (jpeg, png, gif, webp, bmp, tiff)
- Máximo 10 arquivos por request

Processamento (por arquivo):
1. Gerar UUID para nome
2. Abrir com Pillow
3. Redimensionar se maior que 1200x1200 (mantém aspect ratio, thumbnail)
4. Converter para WebP, quality=85
5. Salvar em /app/uploads/products/{uuid}.webp

Response 200:
{
  "urls": ["/uploads/products/abc123.webp", ...]
}
```

### Model Product (alterações)

```python
class Product(Document):
    name: str
    description: str = ""
    price: float
    image_urls: List[str] = Field(default_factory=list)  # era image_url: str
    cover_index: int = 0                                   # novo
    categories: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime
```

### Schemas (alterações)

```python
class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=2000)  # aumentado de 500
    price: float = Field(gt=0)
    image_urls: List[str] = Field(min_length=1, max_length=10)
    cover_index: int = Field(default=0, ge=0)
    categories: List[str] = Field(min_length=1)

class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    image_urls: List[str]
    cover_index: int
    cover_url: str           # computed: image_urls[cover_index]
    categories: List[str]
    is_active: bool
```

### Servir uploads em dev

Em desenvolvimento, o FastAPI serve os arquivos estáticos:

```python
# main.py
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

Em produção, o Nginx serve `/uploads/` diretamente do volume compartilhado.

### Estrutura de arquivos (novos/alterados)

```
backend/
  app/
    api/v1/endpoints/
      uploads.py              # NOVO — endpoint de upload
    services/
      upload_service.py       # NOVO — lógica de processamento
  uploads/                    # NOVO — diretório de arquivos (volume)
    products/

frontend/
  src/
    pages/
      ProductDetailPage.tsx   # NOVO — página de detalhe
    components/
      admin/
        ImageUploader.tsx      # NOVO — componente de upload com preview
      products/
        ProductGallery.tsx     # NOVO — galeria com thumbnails
```

## Frontend

### Formulário Admin (ProductForm) — nova ordem

```
┌─────────────────────────────────────────┐
│  1. Nome           [________________]   │
│  2. Descrição      [________________]   │
│                    [________________]   │  ← textarea, 4 rows
│                    [________________]   │
│  3. Preço (R$)     [________________]   │
│                                         │
│  4. Fotos                               │
│  ┌────────────────────────────────────┐ │
│  │ ImageUploader                      │ │
│  │                                    │ │
│  │ ┌──────┐ ┌──────┐ ┌──────────┐   │ │
│  │ │ img1 │ │ img2 │ │  + Add   │   │ │
│  │ │ ⭐   │ │      │ │  fotos   │   │ │
│  │ │  ✕   │ │  ✕   │ │          │   │ │
│  │ └──────┘ └──────┘ └──────────┘   │ │
│  │                                    │ │
│  │ ⭐ = capa  │ arrastar = reordenar │ │
│  └────────────────────────────────────┘ │
│                                         │
│  5. Categorias     [btn] [btn] [btn]    │
│                                         │
│  [   Criar   ]  [  Cancelar  ]          │
└─────────────────────────────────────────┘
```

### ImageUploader — comportamento

- Input type=file com `accept="image/*"` e `multiple`
- Ao selecionar, faz POST /uploads/images imediatamente
- Mostra preview com loading spinner durante upload
- Cada imagem tem botão ✕ (remover) e ⭐ (definir como capa)
- A imagem com ⭐ define o `cover_index`
- Limite visual: desabilita botão "+" quando chegar a 10
- Drag and drop para reordenar (HTML5 drag API nativa, sem lib)

### Página de Detalhe `/produto/:id`

```
┌─────────────────────────────────────────────────────────────┐
│  ← Voltar para catálogo                          🛒 (3)    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│  │                         │  │  Ração Premium Dog XL    │ │
│  │                         │  │                          │ │
│  │    📷 FOTO PRINCIPAL    │  │  R$ 189,90               │ │
│  │    (cover)              │  │                          │ │
│  │                         │  │  Ração premium para cães │ │
│  │                         │  │  de grande porte com     │ │
│  └─────────────────────────┘  │  ingredientes naturais   │ │
│                               │  e proteína de alta      │ │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐│  qualidade.              │ │
│  │ t1 │ │ t2 │ │ t3 │ │ t4 ││                          │ │
│  └────┘ └────┘ └────┘ └────┘│  Categorias:             │ │
│   ▲ clica = troca principal  │  [Ração] [Premium]       │ │
│                               │                          │ │
│                               │  [ + Adicionar ao 🛒 ]  │ │
│                               └──────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- GET /products/:id para buscar dados
- Foto principal = `image_urls[cover_index]`
- Thumbnails = todas as fotos, clique troca a principal (estado local)
- Botão "Voltar" usa `navigate(-1)` ou link para `/`
- Responsivo: no mobile, foto fica em cima e info embaixo (stack vertical)

### ProductCard — alteração

- `image_url` → `image_urls[cover_index]` (ou `cover_url` do response)
- Ao clicar no card (exceto botão Add), navega para `/produto/:id`

### Tipos TypeScript (alterações)

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];     // era image_url: string
  cover_index: number;      // novo
  cover_url: string;        // novo (computed pelo backend)
  categories: string[];
  is_active: boolean;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;        // mantém string (usa cover_url)
  quantity: number;
}
```

## Docker / Infraestrutura

### docker-compose.yml — alterações

```yaml
services:
  api:
    volumes:
      - ./backend/app:/app/app
      - uploads_data:/app/uploads      # NOVO

  frontend:
    # dev não precisa do volume (acessa API direto)

volumes:
  mongo_data: {}
  uploads_data: {}                     # NOVO
```

Em produção, o Nginx também monta o volume:
```yaml
  frontend:
    volumes:
      - uploads_data:/uploads:ro       # servir estático
```

### nginx.conf — novo location

```nginx
location /uploads/ {
    alias /uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Dependência nova

```
# requirements.txt
Pillow>=10.0
```

## Compatibilidade / Migração

Produtos existentes com `image_url` (string) precisam ser migrados para `image_urls` (lista). Opções:

1. **Script de migração**: converte `image_url` para `image_urls: [image_url]` e `cover_index: 0`
2. **Fallback no código**: se `image_urls` estiver vazio, usar `image_url` como fallback

Como o projeto ainda está em desenvolvimento (não tem dados de produção), o mais simples é **alterar o model diretamente** sem script de migração. Se houver dados de teste no MongoDB, limpar com `db.products.drop()`.
