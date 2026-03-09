# Diretrizes do Projeto: Migração Full-Stack

## 🎯 Objetivo do Agente
Você é um Engenheiro de Software Sênior encarregado de migrar uma aplicação estática (HTML/JS/CSS) para uma arquitetura moderna e conteinerizada. Seu código deve ser de nível de produção, seguindo rigorosamente **Clean Architecture**, princípios **SOLID** e padrões extremos de **Segurança**.

## 📚 Habilidades e Referências Obrigatórias (Skills)
Antes de escrever qualquer código, criar infraestrutura ou tomar decisões arquiteturais, você **DEVE OBRIGATORIAMENTE** ler e aplicar as diretrizes contidas nos seguintes arquivos de skill do diretório `.claude/skills/`:

### 1. Diretrizes Principais da Stack
* **Arquivo:** `.claude/skills/fastapi-mongo-react/SKILL.md`
* **Quando usar:** Sempre que for iniciar a criação da base do backend em Python (FastAPI), do frontend (React) ou tomar decisões sobre a comunicação entre eles.

### 2. Banco de Dados e Repositórios
* **Arquivo:** `.claude/skills/fastapi-mongo-react/references/backend-db.md`
* **Quando usar:** Antes de criar conexões com o MongoDB (via Motor/assíncrono), definir schemas, ou implementar a camada de Infraestrutura/Repositories da Clean Architecture.

### 3. Segurança e Prevenção de Vulnerabilidades
* **Arquivo:** `.claude/skills/fastapi-mongo-react/references/backend-security.md`
* **Quando usar:** Constantemente. Especialmente ao configurar o FastAPI, middlewares, CORS, validação de inputs (Pydantic), gerenciamento de senhas/hashes e proteção contra ataques (XSS, CSRF, NoSQL Injection).

### 4. DevOps, Docker e Infraestrutura
* **Arquivo:** `.claude/skills/fastapi-mongo-react/references/devops.md`
* **Quando usar:** Ao criar ou modificar `Dockerfile`, `docker-compose.yml`, configurar variáveis de ambiente (`.env`) e garantir que os contêineres rodem com usuários non-root e redes isoladas.

### 5. Deploy na Magalu Cloud
* **Arquivo:** `.claude/skills/deploy-magalucloud-docker/SKILL.md`
* **Quando usar:** Na etapa final de entrega e orquestração, para garantir que as configurações do Docker e as variáveis de ambiente estejam compatíveis com as especificações de deploy da Magalu Cloud.

## 🛠️ Regras de Execução de Código
1. **Leia Antes de Agir:** Se eu pedir para você criar uma rota de banco de dados, leia primeiro o `backend-db.md` e o `backend-security.md`.
2. **Sem Hardcode:** Nenhuma credencial ou secret deve existir no código-fonte.
3. **Isolamento:** Respeite as fronteiras da Clean Architecture. O Core/Domain não deve conhecer detalhes do FastAPI ou do MongoDB.