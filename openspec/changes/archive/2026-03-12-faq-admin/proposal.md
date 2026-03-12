# Proposal: FAQ Gerenciável no Admin

## Problema

A seção de contato da home exibe um mapa estático (iframe OpenStreetMap) que não agrega valor prático ao usuário de um serviço de delivery. Além disso, perguntas frequentes sobre entrega, pagamento e área de cobertura precisam ser respondidas em outro canal (WhatsApp, etc), criando atrito desnecessário antes da compra.

## Solução

Substituir o mapa por um accordion de **Perguntas Frequentes** gerenciável pelo admin:

1. **Backend CRUD de FAQ** — modelo `FaqItem` com `question`, `answer`, `order` e `is_active`, seguindo o padrão já estabelecido (Banner, Brand, Category)
2. **Painel admin** — página de listagem com drag-and-drop para reordenação + form de criação/edição
3. **Accordion na home** — componente `FaqAccordion` na `ContactSection`, cada item abre/fecha independentemente, dados vindos do `GET /faqs`
4. **Atualização da seção** — título muda de "Onde estamos" para "Contato & Perguntas Frequentes"

## Escopo

### Backend
- `FaqItem` Beanie Document: `question`, `answer`, `order: int`, `is_active: bool`
- Endpoints: `GET /faqs` (público), `GET /faqs/all` (admin), `GET /faqs/{id}` (admin), `POST /faqs` (admin), `PATCH /faqs/{id}` (admin), `DELETE /faqs/{id}` (admin), `PATCH /faqs/reorder` (admin)

### Frontend Admin
- `FaqPage.tsx` — listagem com drag-and-drop (HTML5 drag API, mesmo padrão do `ImageUploader`) e botões editar/deletar
- `FaqFormPage.tsx` — form criar/editar com campos `question` (input) e `answer` (textarea)
- Rotas `/admin/faqs`, `/admin/faqs/new`, `/admin/faqs/:id`
- Link "Gerenciar FAQ" no `DashboardPage`

### Frontend Home
- `FaqAccordion.tsx` — busca `GET /faqs`, renderiza accordion independente (cada item tem seu próprio `useState`)
- `ContactSection.tsx` — remove iframe do mapa, substitui pela `FaqAccordion`, atualiza título

## Não-escopo

- Autenticação ou permissões além do padrão ADMIN já existente
- Paginação no admin (volume de FAQs é pequeno)
- Animação CSS no accordion além do básico
- FAQ em outras páginas além da home
