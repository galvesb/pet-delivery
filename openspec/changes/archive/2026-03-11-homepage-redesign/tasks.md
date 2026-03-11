# Tasks: Redesign da HomePage com Novas Seções

## Backend — Models e Banco

- [x] 1. Criar `backend/app/models/banner.py` — model Banner (Beanie Document) com campos: title (str), subtitle (str, default ""), bg_color (str, default "#FF6B35"), text_color (str, default "#FFFFFF"), link_url (str, default ""), link_text (str, default ""), is_active (bool, default True), order (int, default 0). Settings: name = "banners"

- [x] 2. Criar `backend/app/models/brand.py` — model Brand (Beanie Document) com campos: name (str), logo_url (str), is_active (bool, default True), order (int, default 0). Settings: name = "brands"

- [x] 3. Modificar `backend/app/models/product.py` — adicionar campo `is_featured: bool = False`

- [x] 4. Atualizar `backend/app/db/mongodb.py` — importar Banner e Brand, adicionar ao array `document_models` no `init_beanie`

## Backend — Schemas

- [x] 5. Criar `backend/app/schemas/banner.py` — BannerCreate (title: str min 2 max 200, subtitle: str max 500, bg_color: str regex hex, text_color: str regex hex, link_url: str max 500, link_text: str max 100, is_active: bool = True, order: int = 0), BannerUpdate (todos opcionais), BannerResponse (id: str + todos os campos)

- [x] 6. Criar `backend/app/schemas/brand.py` — BrandCreate (name: str min 2 max 100, logo_url: str, is_active: bool = True, order: int = 0), BrandUpdate (todos opcionais), BrandResponse (id: str + todos os campos)

- [x] 7. Modificar `backend/app/schemas/product.py` — adicionar `is_featured: bool = False` em ProductCreate, `is_featured: Optional[bool] = None` em ProductUpdate, `is_featured: bool` em ProductResponse

## Backend — Repositories

- [x] 8. Criar `backend/app/db/repositories/banner_repo.py` — BannerRepository herda BaseRepository[Banner], método `find_active()` que retorna banners com is_active=True ordenados por +order

- [x] 9. Criar `backend/app/db/repositories/brand_repo.py` — BrandRepository herda BaseRepository[Brand], método `find_active()` que retorna brands com is_active=True ordenados por +order

- [x] 10. Modificar `backend/app/db/repositories/product_repo.py` — no método `search_products`, adicionar parâmetro `featured: Optional[bool] = None`; se presente, adicionar `is_featured: featured` ao dict filters

## Backend — Services

- [x] 11. Criar `backend/app/services/banner_service.py` — seguindo padrão de product_service: banner_repo = BannerRepository(); funções async: list_active() retorna lista de BannerResponse; list_all() retorna todos; get_banner(id); create_banner(data: BannerCreate); update_banner(id, data: BannerUpdate); delete_banner(id)

- [x] 12. Criar `backend/app/services/brand_service.py` — seguindo padrão de product_service: brand_repo = BrandRepository(); funções async: list_active() retorna lista de BrandResponse; list_all() retorna todos; get_brand(id); create_brand(data: BrandCreate); update_brand(id, data: BrandUpdate); delete_brand(id)

## Backend — Endpoints

- [x] 13. Criar `backend/app/api/v1/endpoints/banners.py` — APIRouter prefix="/banners", tags=["banners"]; GET "" (público, lista ativos via list_active); GET "/all" (admin, lista todos via list_all); POST "" (admin, cria); PUT "/{id}" (admin, atualiza); DELETE "/{id}" (admin, 204)

- [x] 14. Criar `backend/app/api/v1/endpoints/brands.py` — APIRouter prefix="/brands", tags=["brands"]; GET "" (público, lista ativos via list_active); GET "/all" (admin, lista todos via list_all); POST "" (admin, cria); PUT "/{id}" (admin, atualiza); DELETE "/{id}" (admin, 204)

- [x] 15. Atualizar `backend/app/api/v1/router.py` — importar e incluir banners.router e brands.router

- [x] 16. Modificar `backend/app/api/v1/endpoints/products.py` — adicionar query param `featured: Optional[bool] = Query(None)` ao endpoint list_products; passar para product_service.search_products

- [x] 17. Modificar `backend/app/services/product_service.py` — adicionar param `featured` em search_products(); passá-lo ao product_repo.search_products(); adicionar is_featured ao _to_response()

## Frontend — Tipos

- [x] 18. Atualizar `frontend/src/types/index.ts` — adicionar interfaces Banner (id, title, subtitle, bg_color, text_color, link_url, link_text, is_active, order) e Brand (id, name, logo_url, is_active, order); adicionar `is_featured: boolean` à interface Product

## Frontend — Componentes Home

- [x] 19. Criar `frontend/src/components/home/PromoBanner.tsx` — busca GET /banners na montagem; se nenhum banner, retorna null; renderiza strip horizontal do primeiro banner com bg_color/text_color como inline styles; se link_url presente, mostra Link com link_text

- [x] 20. Criar `frontend/src/components/home/FeaturedProducts.tsx` — busca GET /products?featured=true&limit=4; se nenhum produto, retorna null; grid 4 cols (desktop) / 2 cols (mobile); card com cover_url, nome, preço formatado (R$), Link "Ver" → /produto/:id; link "Ver todos" → /products no final

- [x] 21. Criar `frontend/src/components/home/HowItWorks.tsx` — 3 cards estáticos: (1) "Escolha seus produtos" com ícone carrinho, (2) "Pague online" com ícone cartão, (3) "Receba em casa" com ícone pacote; título da seção "Como funciona"; grid 3 cols (desktop) / stack (mobile)

- [x] 22. Criar `frontend/src/components/home/Testimonials.tsx` — 3 depoimentos hardcoded com nome, texto e 5 estrelas; título "O que nossos clientes dizem"; grid 3 cols (desktop) / stack (mobile)

- [x] 23. Criar `frontend/src/components/home/BrandPartners.tsx` — busca GET /brands na montagem; se nenhuma marca, retorna null; exibe logos em linha horizontal flex-wrap com gap; imagens com max-height 60px; título "Marcas parceiras"

- [x] 24. Criar `frontend/src/components/home/ContactSection.tsx` — duas colunas (desktop) / stack (mobile); coluna esquerda: endereço "Rua Victor Augusto Mesquita, 458 - Massaguaçu - Caraguatatuba", telefone "(11) 96341-6515" (link tel:), horário "Seg-Sáb, 8h às 19h", link Instagram; coluna direita: iframe OpenStreetMap embed apontando para Massaguaçu, Caraguatatuba com loading="lazy"

## Frontend — HomePage

- [x] 25. Atualizar `frontend/src/pages/HomePage.tsx` — remover import e uso de ProductCatalog; importar e compor na ordem: Hero, PromoBanner, FeaturedProducts, HowItWorks, ServicesGrid, Testimonials, BrandPartners, ContactSection

## Frontend — CSS

- [x] 26. Adicionar estilos em `frontend/src/styles/global.css` — seções: .promo-banner (strip horizontal, padding, texto centralizado), .featured-products (grid 4 cols, card com imagem/nome/preço, responsivo 2 cols em mobile), .how-it-works (grid 3 cols, cards com ícone/título/desc, setas entre cards em desktop), .testimonials (grid 3 cols, cards com quote/nome/estrelas), .brand-partners (flex row wrap, logos com grayscale, hover remove grayscale), .contact-section (grid 2 cols, info + mapa iframe responsivo)

## Frontend — Admin Banners

- [x] 27. Criar `frontend/src/pages/admin/BannersPage.tsx` — seguindo padrão de ProductsPage: busca GET /banners/all; tabela com colunas: título, ativo (sim/não), ordem, ações (editar/excluir); botão "+ Novo Banner" → /admin/banners/new; excluir com confirm + DELETE /banners/:id

- [x] 28. Criar `frontend/src/pages/admin/BannerFormPage.tsx` — seguindo padrão de ProductFormPage: useParams() para id; modo create/edit; formulário com campos: title, subtitle, bg_color (input type="color"), text_color (input type="color"), link_url, link_text, order (number), is_active (checkbox); preview do banner ao vivo; POST ou PUT conforme modo

## Frontend — Admin Brands

- [x] 29. Criar `frontend/src/pages/admin/BrandsPage.tsx` — seguindo padrão de ProductsPage: busca GET /brands/all; tabela com colunas: logo (thumbnail 40px), nome, ordem, ações (editar/excluir); botão "+ Nova Marca" → /admin/brands/new

- [x] 30. Criar `frontend/src/pages/admin/BrandFormPage.tsx` — seguindo padrão de ProductFormPage: useParams() para id; formulário com campos: name, logo upload (usa endpoint /uploads/images existente, 1 imagem), order (number), is_active (checkbox); preview do logo

## Frontend — Admin ProductForm

- [x] 31. Modificar `frontend/src/components/admin/ProductForm.tsx` — adicionar checkbox "Produto em destaque" (is_featured) ao formulário; incluir no estado inicial e no submit data

## Frontend — Rotas e Navegação

- [x] 32. Atualizar `frontend/src/App.tsx` — importar BannersPage, BannerFormPage, BrandsPage, BrandFormPage; adicionar 6 rotas dentro do ProtectedRoute admin: /admin/banners, /admin/banners/new, /admin/banners/:id/edit, /admin/brands, /admin/brands/new, /admin/brands/:id/edit

- [x] 33. Atualizar `frontend/src/pages/admin/DashboardPage.tsx` — adicionar cards/links para "Banners" e "Marcas" no painel admin

## Limpeza

- [x] 34. Remover `frontend/src/components/home/ProductCatalog.tsx` — arquivo não mais utilizado após a remoção da seção da HomePage
