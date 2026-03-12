# Tasks: FAQ Gerenciável no Admin

## Backend — Model & Schema

- [x] Criar `backend/app/models/faq.py` com `FaqItem` (question, answer, order, is_active)
- [x] Criar `backend/app/schemas/faq.py` com `FaqCreate`, `FaqUpdate`, `FaqReorderRequest`, `FaqResponse`

## Backend — Repository & Service

- [x] Criar `backend/app/db/repositories/faq_repo.py` com `find_all_active`, `find_all`, `find_by_id`, `create`, `update`, `delete`, `reorder`
- [x] Criar `backend/app/services/faq_service.py` com `list_active`, `list_all`, `get_faq`, `create_faq`, `update_faq`, `delete_faq`, `reorder_faqs`

## Backend — Endpoints & Router

- [x] Criar `backend/app/api/v1/endpoints/faqs.py` com todos os endpoints (GET público, CRUD admin, reorder admin)
- [x] Registrar `faqs.router` em `backend/app/api/v1/router.py`

## Frontend Admin — Páginas

- [x] Criar `frontend/src/pages/admin/FaqPage.tsx` com listagem, drag-and-drop para reordenação e botões editar/deletar
- [x] Criar `frontend/src/pages/admin/FaqFormPage.tsx` com form de criação/edição (question, answer, is_active)

## Frontend Admin — Navegação

- [x] Adicionar rotas `/admin/faqs`, `/admin/faqs/new`, `/admin/faqs/:id` no `frontend/src/App.tsx`
- [x] Adicionar link "Gerenciar FAQ" no `frontend/src/pages/admin/DashboardPage.tsx`

## Frontend Home — Accordion

- [x] Criar `frontend/src/components/home/FaqAccordion.tsx` com accordion independente por item usando `Set<string>` de ids abertos
- [x] Adicionar estilos do accordion (`.faq-item`, `.faq-question`, `.faq-answer`, `.faq-icon`) em `frontend/src/styles/global.css`

## Frontend Home — ContactSection

- [x] Atualizar `frontend/src/components/home/ContactSection.tsx`: buscar `GET /faqs`, remover iframe do mapa, renderizar `FaqAccordion`, atualizar título para "Contato & Perguntas Frequentes"
