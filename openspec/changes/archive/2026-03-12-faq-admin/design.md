# Design: FAQ Gerenciável no Admin

## Backend

### `backend/app/models/faq.py` (novo)
```python
class FaqItem(Document):
    question: str
    answer: str
    order: int = 0
    is_active: bool = True

    class Settings:
        name = "faqs"
```

### `backend/app/schemas/faq.py` (novo)
```python
class FaqCreate(BaseModel):
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)
    is_active: bool = True

class FaqUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    is_active: bool | None = None

class FaqReorderRequest(BaseModel):
    ids: List[str]   # array de ids na nova ordem

class FaqResponse(BaseModel):
    id: str
    question: str
    answer: str
    order: int
    is_active: bool
```

### `backend/app/db/repositories/faq_repo.py` (novo)
Segue padrão de `banner_repo.py`:
- `find_all_active()` — filtra `is_active=True`, ordena por `order`
- `find_all()` — sem filtro, para o admin
- `find_by_id(id)`
- `create(data)`
- `update(item, data)`
- `delete(item)`
- `reorder(ids)` — para cada id no array, atualiza `order = index`

### `backend/app/services/faq_service.py` (novo)
Funções: `list_active`, `list_all`, `get_faq`, `create_faq`, `update_faq`, `delete_faq`, `reorder_faqs`

### `backend/app/api/v1/endpoints/faqs.py` (novo)
```
GET  /faqs          → list_active (público)
GET  /faqs/all      → list_all (ADMIN)
GET  /faqs/{id}     → get_faq (ADMIN)
POST /faqs          → create_faq (ADMIN)
PATCH /faqs/{id}    → update_faq (ADMIN)
DELETE /faqs/{id}   → delete_faq (ADMIN)
PATCH /faqs/reorder → reorder_faqs (ADMIN) — body: { ids: [...] }
```

**Atenção:** `/faqs/reorder` deve ser registrado ANTES de `/faqs/{id}` no router para evitar conflito de rota.

### `backend/app/api/v1/router.py` (alterado)
Adicionar `from app.api.v1.endpoints import faqs` e `router.include_router(faqs.router)`.

---

## Frontend Admin

### `frontend/src/pages/admin/FaqPage.tsx` (novo)
- Busca `GET /faqs/all` ao montar
- Lista FAQs com drag handles (`≡`), botões editar (→ `/admin/faqs/:id`) e deletar
- Drag-and-drop via HTML5 drag API (mesmo padrão do `ImageUploader`):
  - `dragIndex = useRef<number | null>(null)`
  - `onDragStart` → salva index
  - `onDragOver` → `preventDefault()`
  - `onDrop` → reordena array local + chama `PATCH /faqs/reorder`
- Botão "Nova Pergunta" → `/admin/faqs/new`

### `frontend/src/pages/admin/FaqFormPage.tsx` (novo)
- Modo criar (`/admin/faqs/new`) ou editar (`/admin/faqs/:id`)
- Campos: `question` (input text, obrigatório), `answer` (textarea, obrigatório), `is_active` (checkbox)
- Submit: `POST /faqs` ou `PATCH /faqs/:id`
- Redireciona para `/admin/faqs` após salvar

### `frontend/src/App.tsx` (alterado)
Adicionar rotas protegidas admin:
```tsx
<Route path="/admin/faqs" element={<FaqPage />} />
<Route path="/admin/faqs/new" element={<FaqFormPage />} />
<Route path="/admin/faqs/:id" element={<FaqFormPage />} />
```

### `frontend/src/pages/admin/DashboardPage.tsx` (alterado)
Adicionar link "Gerenciar FAQ" no grid de ações.

---

## Frontend Home

### `frontend/src/components/home/FaqAccordion.tsx` (novo)
```
Props: items: FaqItem[]

Cada item tem seu próprio estado aberto/fechado (useState por item não —
usar um único useState<string | null> com o id do item aberto para
comportamento "só um por vez" — mas conforme decidido no explore,
cada um abre/fecha INDEPENDENTEMENTE):

→ usar: const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  toggle: adiciona/remove id do Set

Markup por item:
  <div className="faq-item">
    <button className="faq-question" onClick={toggle}>
      <span>{item.question}</span>
      <span className="faq-icon">{isOpen ? "−" : "+"}</span>
    </button>
    {isOpen && (
      <div className="faq-answer">{item.answer}</div>
    )}
  </div>
```

### `frontend/src/components/home/ContactSection.tsx` (alterado)
1. Adicionar `useEffect` que busca `GET /faqs` → `setFaqs(res.data)`
2. Remover `<div className="contact-map">` com o iframe
3. Substituir por `<FaqAccordion items={faqs} />`
4. Alterar título de `"Onde estamos"` para `"Contato & Perguntas Frequentes"`
5. Renderizar `FaqAccordion` só se `faqs.length > 0` (não deixar coluna vazia)

### CSS — `frontend/src/styles/global.css` (alterado)
Adicionar estilos para o accordion:
```css
.faq-item { border-bottom: var(--border-thick); }
.faq-question { /* botão full-width, flex, space-between */ }
.faq-answer { padding: 12px 16px; color: var(--gray-text); }
.faq-icon { font-size: 20px; font-weight: 700; }
```

---

## Fluxo de dados

```
Admin cadastra FAQ
      ↓
POST /faqs → MongoDB (is_active=true, order=auto)
      ↓
GET /faqs (público) → retorna ativos ordenados por order
      ↓
ContactSection → FaqAccordion → accordion interativo na home
```
