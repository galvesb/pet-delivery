# Design: Redesign do Painel Administrativo com Sidebar

## 1. AdminLayout — Estrutura com Sidebar

### `frontend/src/components/layout/AdminLayout.tsx` (reescrita)

**Antes:** Header top + `<main><Outlet /></main>`

**Depois:**
```tsx
<div className="admin-layout">
  {/* Overlay mobile */}
  {sidebarOpen && <div className="admin-overlay" onClick={closeSidebar} />}

  {/* Sidebar */}
  <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
    <div className="admin-sidebar-header">
      <Link to="/admin" className="admin-logo">🐾 HomePet Admin</Link>
    </div>

    <nav className="admin-nav">
      <div className="admin-nav-group">
        <span className="admin-nav-label">PRINCIPAL</span>
        <NavLink to="/admin" end className={...}>📊 Dashboard</NavLink>
      </div>
      <div className="admin-nav-group">
        <span className="admin-nav-label">CATÁLOGO</span>
        <NavLink to="/admin/products" className={...}>📦 Produtos</NavLink>
        <NavLink to="/admin/categories" className={...}>🏷️ Categorias</NavLink>
        <NavLink to="/admin/brands" className={...}>🏢 Marcas</NavLink>
      </div>
      <div className="admin-nav-group">
        <span className="admin-nav-label">CONTEÚDO</span>
        <NavLink to="/admin/banners" className={...}>🎯 Banners</NavLink>
        <NavLink to="/admin/faqs" className={...}>❓ FAQ</NavLink>
      </div>
    </nav>

    <div className="admin-sidebar-footer">
      <Link to="/">← Ver loja</Link>
      <a onClick={handleLogout}>Sair</a>
    </div>
  </aside>

  {/* Conteúdo principal */}
  <div className="admin-content">
    <header className="admin-topbar">
      <button className="admin-menu-toggle" onClick={toggleSidebar}>☰</button>
      <button className="btn btn-outline" onClick={handleLogout}>Sair</button>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
</div>
```

**Estado:** `sidebarOpen` com `useState(false)`, toggle no ☰ mobile.

**NavLink ativo:** usar `className` callback do React Router: item ativo recebe classe `.active`.

---

## 2. CSS da Sidebar

### `frontend/src/styles/global.css` — Substituir estilos `.admin-*`

```css
/* Layout base */
.admin-layout {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.admin-sidebar {
    width: 240px;
    background: var(--white);
    border-right: var(--border-thick);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 200;
}

.admin-sidebar-header {
    padding: 24px 20px;
    border-bottom: var(--border-thick);
}

.admin-logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-red);
}

/* Navegação */
.admin-nav {
    flex: 1;
    padding: 16px 0;
    overflow-y: auto;
}

.admin-nav-group {
    margin-bottom: 16px;
}

.admin-nav-label {
    display: block;
    padding: 0 20px;
    margin-bottom: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--gray-text);
    font-weight: 600;
}

.admin-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
    transition: all 0.15s;
    border-left: 3px solid transparent;
}

.admin-nav-link:hover {
    background: var(--bg-color);
}

.admin-nav-link.active {
    background: var(--light-red);
    color: var(--primary-red);
    border-left-color: var(--primary-red);
    font-weight: 700;
}

/* Footer da sidebar */
.admin-sidebar-footer {
    padding: 16px 20px;
    border-top: var(--border-thick);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.admin-sidebar-footer a {
    font-size: 14px;
    color: var(--gray-text);
    cursor: pointer;
}

.admin-sidebar-footer a:hover {
    color: var(--primary-red);
}

/* Conteúdo principal */
.admin-content {
    flex: 1;
    margin-left: 240px;
}

.admin-topbar {
    display: none; /* Aparece só no mobile */
}

/* Overlay mobile */
.admin-overlay {
    display: none;
}

/* Mobile */
@media (max-width: 768px) {
    .admin-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }
    .admin-sidebar.open {
        transform: translateX(0);
    }
    .admin-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        z-index: 199;
    }
    .admin-content {
        margin-left: 0;
    }
    .admin-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: var(--border-thick);
        background: var(--white);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .admin-menu-toggle {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }
}
```

---

## 3. DashboardPage — Redesign

### `frontend/src/pages/admin/DashboardPage.tsx` (reescrita)

**Estrutura:**
```
┌──────────────────────────────────────────────┐
│ h1: Dashboard                                │
│ p: Gerencie categorias e produtos do HomePet │
│                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │    42    │ │     8    │ │     5    │     │
│ │ Produtos │ │Categorias│ │  Marcas  │     │
│ └──────────┘ └──────────┘ └──────────┘     │
│                                              │
│ ┌──────────────────┐ ┌──────────────────┐   │
│ │ Últimos          │ │ Hoje, 12 Mar     │   │
│ │ Agendamentos     │ │                  │   │
│ │                  │ │ 10:00 Banho      │   │
│ │ Maria Silva      │ │       Bella      │   │
│ │ Banho e Tosa     │ │                  │   │
│ │ 12 Mar, 10:00    │ │ 14:30 Consulta   │   │
│ │                  │ │       Rex        │   │
│ │ João Santos      │ │                  │   │
│ │ Veterinário      │ │ 16:00 Banho      │   │
│ │ 12 Mar, 14:30    │ │       Luna       │   │
│ └──────────────────┘ └──────────────────┘   │
└──────────────────────────────────────────────┘
```

**Cards de contagem:** 3 colunas (desktop), 2+1 (tablet), 1 (mobile ≤480px). Buscar contagem de produtos, categorias e marcas da API.

**Dados hardcoded de agendamentos:**
```ts
const agendamentos = [
  { cliente: "Maria Silva", servico: "Banho e Tosa", pet: "Bella (Poodle)", data: "12 Mar, 10:00" },
  { cliente: "João Santos", servico: "Consulta Veterinária", pet: "Rex (Labrador)", data: "12 Mar, 14:30" },
  { cliente: "Ana Oliveira", servico: "Banho", pet: "Luna (Golden)", data: "12 Mar, 16:00" },
  { cliente: "Carlos Lima", servico: "Tosa Higiênica", pet: "Thor (Shih Tzu)", data: "13 Mar, 09:00" },
  { cliente: "Fernanda Costa", servico: "Vacinação", pet: "Mia (Gato)", data: "13 Mar, 11:00" },
];

const agendaHoje = [
  { horario: "10:00", servico: "Banho e Tosa", pet: "Bella" },
  { horario: "14:30", servico: "Consulta Vet.", pet: "Rex" },
  { horario: "16:00", servico: "Banho", pet: "Luna" },
];
```

**Layout 2 colunas:** `display: grid; grid-template-columns: 1fr 1fr; gap: 24px;` → mobile: 1 coluna.

---

## Impacto visual esperado

```
ANTES:                               DEPOIS:
┌────────────────────────┐           ┌────────┬────────────────┐
│ HomePet Admin   [Sair] │           │  🐾    │ Dashboard      │
├────────────────────────┤           │ Admin  │                │
│                        │           │        │ ┌──┐ ┌──┐ ┌──┐│
│  ┌────┐  ┌────┐       │           │ Dashb. │ │42│ │ 8│ │ 5││
│  │ 42 │  │  8 │       │           │ Prod.  │ └──┘ └──┘ └──┘│
│  └────┘  └────┘       │           │ Categ. │                │
│                        │           │ Marcas │ Agend. │ Hoje  │
│ [Prod] [Cat] [Ban]    │           │ Banner │ ───── │ ───── │
│ [Marc] [FAQ] [Loja]   │           │ FAQ    │ Maria │ 10:00 │
│                        │           │        │ João  │ 14:30 │
└────────────────────────┘           │ ─────  │       │       │
                                     │ Loja   │       │       │
                                     │ Sair   │       │       │
                                     └────────┴────────────────┘
```
