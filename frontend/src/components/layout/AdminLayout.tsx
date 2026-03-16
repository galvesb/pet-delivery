import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `admin-nav-link${isActive ? " active" : ""}`;

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-overlay" onClick={closeSidebar} />}

      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo" onClick={closeSidebar}>
            🐾 HomePet Admin
          </Link>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-group">
            <span className="admin-nav-label">Principal</span>
            <NavLink to="/admin" end className={navLinkClass} onClick={closeSidebar}>
              📊 Dashboard
            </NavLink>
          </div>
          <div className="admin-nav-group">
            <span className="admin-nav-label">Catálogo</span>
            <NavLink to="/admin/products" className={navLinkClass} onClick={closeSidebar}>
              📦 Produtos
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClass} onClick={closeSidebar}>
              🏷️ Categorias
            </NavLink>
            <NavLink to="/admin/brands" className={navLinkClass} onClick={closeSidebar}>
              🏢 Marcas
            </NavLink>
          </div>
          <div className="admin-nav-group">
            <span className="admin-nav-label">Conteúdo</span>
            <NavLink to="/admin/banners" className={navLinkClass} onClick={closeSidebar}>
              🎯 Banners
            </NavLink>
            <NavLink to="/admin/faqs" className={navLinkClass} onClick={closeSidebar}>
              ❓ FAQ
            </NavLink>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" onClick={closeSidebar}>← Ver loja</Link>
          <a onClick={handleLogout} style={{ cursor: "pointer" }}>Sair</a>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <span className="admin-topbar-logo">🐾 HomePet Admin</span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ fontSize: 13, padding: "6px 12px" }}>
            Sair
          </button>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
