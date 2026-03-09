# Spec: Formulário de Produto (Reformulação)

## Alterações no formulário admin

### Nova ordem dos campos

1. Nome (input text — sem alteração)
2. Descrição (`textarea` com 4 rows, max 2000 caracteres — era input com max 500)
3. Preço (input number — sem alteração)
4. Fotos (ImageUploader — substitui campo URL)
5. Categorias (toggle buttons — sem alteração)

### ImageUploader

- Input `type="file"` com `accept="image/*"` e `multiple`
- Ao selecionar arquivos, faz `POST /uploads/images` imediatamente
- Mostra preview de cada imagem com loading durante upload
- Cada imagem tem:
  - Botão ✕ para remover
  - Botão/indicador ⭐ para definir como capa
- A primeira imagem é capa por default (⭐ automático)
- Clicar ⭐ em outra imagem muda o `cover_index`
- Desabilita botão "+" quando atingir 10 fotos
- Drag and drop nativo (HTML5) para reordenar
- Obrigatório ao menos 1 foto para criar produto

### Edição de produto existente

- Carrega imagens existentes como thumbnails (já têm URL)
- Permite adicionar novas fotos (até completar 10)
- Permite remover fotos existentes
- Permite trocar a capa
- Permite reordenar
