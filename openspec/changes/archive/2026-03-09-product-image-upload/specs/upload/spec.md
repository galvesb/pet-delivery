# Spec: Upload de Imagens

## Endpoint

`POST /api/v1/uploads/images` — somente ADMIN autenticado

## Requisitos

- Aceita `multipart/form-data` com campo `files` (múltiplos arquivos)
- Máximo 10 arquivos por request
- Aceita qualquer formato de imagem (jpeg, png, gif, webp, bmp, tiff)
- Rejeita arquivos que não sejam imagem (validar content-type `image/*`)

## Processamento por arquivo

1. Gerar nome único com UUID4
2. Abrir imagem com Pillow
3. Se qualquer dimensão > 1200px, redimensionar mantendo aspect ratio (`Image.thumbnail((1200, 1200))`)
4. Converter para formato WebP com `quality=85`
5. Salvar em `/app/uploads/products/{uuid}.webp`

## Response

```json
{
  "urls": [
    "/uploads/products/a1b2c3d4.webp",
    "/uploads/products/e5f6g7h8.webp"
  ]
}
```

## Erros

| Status | Condição |
|--------|----------|
| 400 | Nenhum arquivo enviado |
| 400 | Mais de 10 arquivos |
| 400 | Arquivo não é imagem (content-type inválido) |
| 400 | Arquivo corrompido (Pillow não consegue abrir) |
| 401 | Não autenticado |
| 403 | Não é ADMIN |

## Diretório de uploads

- Path: `/app/uploads/products/`
- Criado automaticamente se não existir
- Montado como volume Docker (`uploads_data`)
- Em dev: servido pelo FastAPI (`StaticFiles`)
- Em prod: servido pelo Nginx
