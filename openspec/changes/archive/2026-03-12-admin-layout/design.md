# Design: Layout Separado para o Painel Admin

## Estrutura de Rotas no App.tsx

### Antes
```
App
├── PromoBanner (global)
├── Header (global)
├── main > Routes
│   ├── / → HomePage
│   ├── /login → LoginPage
│   ├── /register → RegisterPage
│   ├── /products → ProductsPage
│   ├── /produto/:id → ProductDetailPage
│   └── ProtectedRoute (ADMIN)
│       ├── /admin → DashboardPage
│       ├── /admin/products → AdminProductsPage
│       └── ... demais rotas admin
├── Footer (global)
├── CartOverlay (global)
└── CartSidebar (global)
```

### Depois
```
App
└── Routes
    ├── PublicLayout (elemento wrapper)
    │   ├── PromoBanner
    │   ├── Header
    │   ├── main > Outlet
    │   │   ├── / → HomePage
    │   │   ├── /login → LoginPage
    │   │   ├── /register → RegisterPage
    │   │   ├── /products → ProductsPage
    │   │   └── /produto/:id → ProductDetailPage
    │   ├── Footer
    │   ├── CartOverlay
    │   └── CartSidebar
    │
    └── ProtectedRoute (ADMIN)
        └── AdminLayout (elemento wrapper)
            ├── header admin
            ├── main > Outlet
            │   ├── /admin → DashboardPage
            │   ├── /admin/products → AdminProductsPage
            │   └── ... demais rotas admin
```

---

## `frontend/src/components/layout/AdminLayout.tsx` (novo)

```tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

export function AdminLayout() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <header className="admin-header">
        <Link to="/admin" className="admin-logo">
          🐾 HomePet Admin
        </Link>
        <div className="admin-header-actions">
          <Link to="/" className="btn btn-outline" style={{ fontSize: 14, padding: "6px 14px" }}>
            ← Ver loja
          </Link>
          {user && (
            <span className="admin-username">{user.full_name.split(" ")[0]}</span>
          )}
          <button className="btn btn-outline" onClick={handleLogout} style={{ fontSize: 14, padding: "6px 14px" }}>
            Sair
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

### CSS do AdminLayout — `frontend/src/styles/global.css`

```css
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background: var(--white);
  border-bottom: var(--border-thick);
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-red);
  text-decoration: none;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-username {
  font-size: 14px;
  color: var(--gray-text);
}
```

---

## `frontend/src/App.tsx` (alterado)

### PublicLayout inline (sem arquivo separado)

O `App.tsx` passa a usar `<Route element={<PublicLayout />}>` para agrupar as rotas públicas. O `PublicLayout` pode ser um componente simples criado dentro do próprio `App.tsx` ou em arquivo separado.

Opção mais limpa: criar `PublicLayout` em arquivo separado `frontend/src/components/layout/PublicLayout.tsx`:

```tsx
import { Outlet } from "react-router-dom";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CartOverlay } from "@/components/cart/CartOverlay";

export function PublicLayout() {
  return (
    <>
      <PromoBanner />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartOverlay />
      <CartSidebar />
    </>
  );
}
```

### App.tsx resultante

```tsx
export function App() {
  return (
    <Routes>
      {/* Layout público */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
      </Route>

      {/* Layout admin (requer role ADMIN) */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/new" element={<ProductFormPage />} />
          <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/banners" element={<BannersPage />} />
          <Route path="/admin/banners/new" element={<BannerFormPage />} />
          <Route path="/admin/banners/:id/edit" element={<BannerFormPage />} />
          <Route path="/admin/brands" element={<BrandsPage />} />
          <Route path="/admin/brands/new" element={<BrandFormPage />} />
          <Route path="/admin/brands/:id/edit" element={<BrandFormPage />} />
          <Route path="/admin/faqs" element={<FaqPage />} />
          <Route path="/admin/faqs/new" element={<FaqFormPage />} />
          <Route path="/admin/faqs/:id" element={<FaqFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

---

## Verificar: ProtectedRoute usa Outlet?

O `ProtectedRoute` existente deve renderizar `<Outlet />` para que o aninhamento de rotas funcione. Se ele renderiza diretamente o conteúdo sem `<Outlet />`, precisará de ajuste mínimo.
