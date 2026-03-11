# Proposal: Redesign da HomePage com Novas Seções

## Problema

A HomePage atual exibe um `ProductCatalog` embutido (com CategoryTabs + ProductGrid) que duplica funcionalidade agora que existe a página dedicada `/products`. A home tem apenas 3 seções (Hero, ServicesGrid, ProductCatalog) e não comunica bem a proposta de valor da petshop.

## Solução

Remover o `ProductCatalog` da home e substituí-lo por 6 novas seções que seguem o fluxo **atrair → converter → convencer → confiar → conectar**, transformando a HomePage em uma landing page completa para a petshop.

### Nova estrutura da HomePage (em ordem):

1. **Hero** (já existe, mantém)
2. **Banner Promocional** — admin configura texto, cores, link; dinâmico via CRUD
3. **Produtos em Destaque** — 4 produtos marcados pelo admin como `featured`; link "Ver todos" → `/products`
4. **Como Funciona** — 3 passos estáticos: Escolha → Pague → Receba
5. **Serviços** (já existe, mantém)
6. **Depoimentos** — 3 cards estáticos hardcoded com avaliações de clientes
7. **Marcas Parceiras** — logos gerenciados pelo admin via CRUD
8. **Contato / Localização** — dados da loja + mapa OpenStreetMap embed

## Escopo

### Inclui

**Backend:**
- Campo `is_featured: bool` no model Product + filtro no endpoint GET /products
- CRUD completo de Banner (model, repo, service, endpoints)
- CRUD completo de Brand (model, repo, service, endpoints)
- Admin pages para gerenciar Banners e Marcas

**Frontend:**
- Remover `ProductCatalog` da HomePage
- 6 novos componentes em `components/home/`: `PromoBanner`, `FeaturedProducts`, `HowItWorks`, `Testimonials`, `BrandPartners`, `ContactSection`
- Admin pages: `BannersPage`, `BrannerFormPage`, `BrandsPage`, `BrandFormPage`
- Rotas admin protegidas para banners e marcas
- CSS responsivo para todas as novas seções

### Não inclui
- Mudanças no Hero ou ServicesGrid existentes
- Sistema de avaliações real (depoimentos são estáticos)
- Upload de imagem para banners (apenas texto/cores)
- Integração com Google Maps (usa OpenStreetMap gratuito)

## Dados Estáticos

**Contato:**
- Endereço: Rua Victor Augusto Mesquita, 458 - Massaguaçu - Caraguatatuba
- Telefone: (11) 96341-6515
- Horário: Segunda a Sábado, 8h às 19h
- Instagram: link para perfil
- Mapa: OpenStreetMap iframe embed
