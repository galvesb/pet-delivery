# Proposal: Persistência do Carrinho

## Problema

Quando o usuário atualiza a página (F5), todos os itens do carrinho somem. O Zustand cartStore usa apenas memória — não há persistência entre navegações.

## Solução

### 1. Zustand `persist` middleware com localStorage
Adicionar o middleware `persist` ao cartStore para salvar `items` no localStorage automaticamente. No refresh, o store reidrata do localStorage.

### 2. Hidratação do servidor no login
Quando o usuário faz login ou a app carrega com sessão ativa, buscar `GET /cart` e aplicar lógica de merge:
- Se localStorage vazio e servidor tem itens → **usa servidor**
- Se localStorage tem itens → **usa localStorage** (intenção recente) e sincroniza de volta pro servidor

### 3. Partialize — só persistir `items`
O campo `isOpen` não deve ser persistido (não faz sentido o carrinho abrir sozinho no refresh).

## Escopo

- Frontend: adicionar `persist` middleware ao cartStore
- Frontend: lógica de hidratação no useCart (GET /cart no login + merge)
- Frontend: limpar localStorage no logout

## Não-escopo

- Mudanças no backend (endpoints de cart já existem)
- Mudanças na estrutura do CartItem
- Persistência do authStore (token fica em memória por segurança)
