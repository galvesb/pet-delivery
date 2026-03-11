# Proposal: Rotas Dedicadas para Formulário de Produto no Admin

## Problema

Na página `/admin/products`, ao clicar em "+ Novo Produto" ou "Editar", o formulário aparece acima da tabela de listagem — mas a tabela continua visível embaixo. Isso cria uma experiência confusa, com dois conteúdos competindo na mesma tela.

## Solução

Separar a listagem e o formulário em rotas distintas:

- `/admin/products` → página de listagem (somente tabela)
- `/admin/products/new` → página de criação (somente formulário)
- `/admin/products/:id/edit` → página de edição (somente formulário, produto carregado pelo id)

O botão "+ Novo Produto" e o botão "Editar" passam a navegar para as respectivas rotas. O formulário tem um botão "← Voltar" que retorna à listagem.

## Escopo

### Inclui
- Nova página `ProductFormPage` em `pages/admin/`
- Refatoração de `ProductsPage` para remover o estado de edição e o `ProductForm` embutido
- Duas novas rotas admin protegidas: `/admin/products/new` e `/admin/products/:id/edit`
- Navegação bidirecional: listagem → formulário → listagem

### Não inclui
- Mudanças no backend
- Mudanças no `ProductForm` (componente reutilizado sem alteração)
- Mudanças no `ProductTable`
