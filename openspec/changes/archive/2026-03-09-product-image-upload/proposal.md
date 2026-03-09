# Proposta: Upload de Imagens e Detalhe do Produto

## Problema

Atualmente o cadastro de produtos exige colar uma URL externa para a imagem, o que é pouco prático para o admin. Além disso, cada produto suporta apenas uma imagem e não existe página de detalhe — ao clicar no card, o usuário só pode adicionar ao carrinho sem ver mais informações.

## Solução

1. **Upload de imagens**: substituir o campo `image_url` por upload direto de arquivos. O backend recebe as imagens, redimensiona (max 1200x1200), converte para WebP (quality 85) e salva em volume Docker local. Suporte a múltiplas fotos por produto (até 10).

2. **Reorganização do formulário**: campo de descrição vira `textarea` maior e fica posicionado antes da seção de fotos.

3. **Página de detalhe do produto** (`/produto/:id`): rota dedicada (Opção B) com galeria de fotos, descrição completa, categorias e botão de adicionar ao carrinho.

## Decisões

| Decisão | Valor |
|---------|-------|
| Max fotos por produto | 10 |
| Limite de tamanho por foto | Sem limite (backend redimensiona) |
| Resize | max 1200x1200, quality 85 |
| Formato de saída | WebP (aceita qualquer formato de entrada) |
| Capa | Admin escolhe; default = primeira foto |
| Detalhe do produto | Página dedicada `/produto/:id` |
| Storage | Volume Docker local (`uploads_data`) |
| Lib de processamento | Pillow |
| Servir arquivos estáticos | Nginx (produção) / FastAPI StaticFiles (dev) |

## Escopo

### Inclui
- Endpoint `POST /uploads/images` (multipart, múltiplos arquivos)
- Processamento de imagem com Pillow (resize + webp)
- Migração do model: `image_url: str` → `image_urls: List[str]` + `cover_index: int`
- Atualização de schemas, services e endpoints de produto
- Formulário admin com upload, preview, drag-to-reorder, seleção de capa
- Página pública `/produto/:id` com galeria e thumbnails
- Volume Docker para uploads
- Nginx servindo `/uploads/` como estático
- Atualização de tipos TypeScript e componentes que usam `image_url`

### Não inclui
- CDN ou object storage externo
- Compressão avançada (progressive webp, AVIF)
- Crop manual pelo admin
- Watermark
