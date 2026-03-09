# Proposal: Migração Full-Stack do HomePet Delivery

## Resumo

Migrar a aplicação estática HomePet Delivery (single `index.html` com CSS/JS inline) para uma arquitetura full-stack moderna e conteinerizada usando **FastAPI + MongoDB + React**, com autenticação completa, painel administrativo e carrinho híbrido.

## Motivação

A aplicação atual é um arquivo HTML único com 6 produtos hardcoded, carrinho em memória (perde ao recarregar), sem autenticação e sem persistência de dados. Isso impede:

- Gestão de produtos e categorias pelo administrador
- Persistência do carrinho entre sessões
- Escalabilidade para novos produtos e funcionalidades
- Segurança e controle de acesso

## Escopo

### Incluso

- **Backend**: API REST com FastAPI, Clean Architecture, MongoDB (Motor + Beanie)
- **Frontend**: React + TypeScript + Vite, tradução fiel do design atual
- **Auth completo**: JWT com refresh token rotation, blacklist, RBAC (ADMIN/CUSTOMER)
- **Categorias dinâmicas**: CRUD no painel admin, com proteção contra exclusão de categorias em uso
- **Produtos**: CRUD administrativo, filtro por categoria, listagem pública
- **Carrinho híbrido**: Zustand local para visitantes, sincronização com API ao logar (merge inteligente)
- **Painel admin**: Gestão de categorias e produtos (rotas protegidas por role ADMIN)
- **Seed do admin**: Criação automática do primeiro admin via variáveis de ambiente no lifespan
- **Infraestrutura**: Docker Compose (FastAPI + React + MongoDB), Dockerfiles multi-stage, redes isoladas
- **Deploy**: Compatível com Magalu Cloud (Makefile + rsync + docker compose)

### Fora do escopo

- Agendamento de serviços (Banho/Tosa, Consulta Veterinária) — será adicionado em change futura
- Checkout/pagamento real — botão mantém comportamento placeholder
- Seed de produtos — cadastro via painel admin
- Upload de imagens — usar URLs externas por enquanto

## Decisões tomadas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Categorias | Dinâmicas (CRUD admin) | Admin controla os filtros sem deploy |
| Categoria no produto | Array de slugs | MongoDB nativo, consulta com `$in` |
| Carrinho | Híbrido (local + server) | UX para visitantes + persistência para logados |
| Cart storage | Subdocumento no User | Sempre acessado junto, evita joins |
| Exclusão de categoria em uso | Bloquear (409) + toast | Seguro, admin reclassifica antes |
| Primeiro admin | Seed no lifespan via `.env` | Automático, idempotente, sem hardcode |
| Auth | Completo (JWT + rotation + RBAC + blacklist) | Segurança de produção desde o início |
| Roles | ADMIN e CUSTOMER | Suficiente para o escopo atual |
| Serviços (Banho/Tosa) | Apresentacional | Implementar em change separada |
