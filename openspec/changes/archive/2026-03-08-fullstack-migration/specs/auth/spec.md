# Spec: Autenticação e Autorização

## Descrição
Sistema completo de autenticação JWT com refresh token rotation, blacklist, e controle de acesso por roles (RBAC).

## Roles
- **ADMIN**: acesso total (CRUD produtos, categorias, listar usuários)
- **CUSTOMER**: acesso ao próprio perfil e carrinho

## Requisitos funcionais

### Registro
- Campos obrigatórios: email (EmailStr), password (min 8, maiúscula + número + especial), full_name (min 2, max 100)
- Validação de senha forte via Pydantic `field_validator`
- Email único (índice unique no MongoDB)
- Role padrão: CUSTOMER
- Rate limit: 5/min

### Login
- Campos: username (email), password
- Retorna: `{ access_token, token_type: "bearer" }` no body
- Refresh token: cookie HttpOnly, Secure, SameSite=Strict, max_age=7 dias
- Rate limit: 5/min
- Erro 401 com mensagem genérica ("Credenciais inválidas")

### Refresh Token
- Lê refresh token do cookie
- Valida JWT + verifica tipo "refresh" + verifica blacklist
- **Rotation**: revoga token atual, emite novo par (access + refresh)
- Novo refresh token no cookie, novo access token no body
- Rate limit: 10/min

### Logout
- Revoga refresh token atual (adiciona hash SHA-256 à blacklist)
- Limpa cookie refresh_token
- Requer autenticação (access token válido)

### Blacklist (RevokedToken)
- Armazena `token_hash` (SHA-256 do token), `revoked_at`, `expires_at`
- TTL index em `expires_at` para limpeza automática pelo MongoDB
- Verificação obrigatória no endpoint de refresh

## Requisitos de segurança
- SECRET_KEY via `.env` (gerado com `openssl rand -hex 32`)
- Bcrypt para hashing de senhas (passlib)
- python-jose para JWT
- Access token: 30 min de expiração
- Refresh token: 7 dias de expiração
- Nunca logar tokens ou senhas

## Dependência injetável
- `get_current_user(token)`: decodifica JWT, busca User, valida `is_active`
- `require_role(*roles)`: verifica `current_user.role in roles`, retorna 403 se não

## Seed do admin
- No lifespan do FastAPI, após `init_beanie`
- Lê `ADMIN_EMAIL` e `ADMIN_PASSWORD` do Settings
- Cria User com role=ADMIN se não existir (idempotente)
- Campos opcionais no `.env` — se não definidos, skip sem erro
