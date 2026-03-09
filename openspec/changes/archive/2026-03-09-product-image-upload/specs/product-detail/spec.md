# Spec: Página de Detalhe do Produto

## Rota

`/produto/:id` — página pública dedicada (Opção B)

## Comportamento

- Ao clicar no ProductCard (exceto botão "+ Add"), navega para `/produto/:id`
- Busca dados via `GET /api/v1/products/:id`
- Exibe foto principal (`image_urls[cover_index]`)
- Thumbnails de todas as fotos abaixo da principal
- Clicar em thumbnail troca a foto principal (estado local, sem request)
- Informações: nome, preço, descrição completa, categorias (como badges)
- Botão "Adicionar ao carrinho"
- Link "Voltar" que navega para a página anterior

## Layout Responsivo

### Desktop (>= 768px)
- Duas colunas: galeria à esquerda, informações à direita

### Mobile (< 768px)
- Stack vertical: galeria em cima, informações embaixo

## Componentes

- `ProductDetailPage` — página que faz fetch e orquestra
- `ProductGallery` — foto principal + thumbnails (clicáveis)

## Erros

- Produto não encontrado (404): exibir mensagem e link para voltar
- Loading: skeleton ou spinner enquanto carrega
