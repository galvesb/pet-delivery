import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { getTotalItems, toggleCart } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="container" style={{ padding: "40px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="logo">
        <Link to="/" style={{ color: "var(--primary-red)", fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", gap: 8 }}>
          🐾 HomePet
        </Link>
      </div>

      <nav>
        <ul className={`nav-links${menuOpen ? " active" : ""}`} id="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Início</Link></li>
          <li><a href="/#servicos" onClick={() => setMenuOpen(false)}>Serviços</a></li>
          <li><a href="/#menu-produtos" onClick={() => setMenuOpen(false)}>Produtos</a></li>
          {user?.role === "ADMIN" && (
            <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
          )}
        </ul>
      </nav>

      <div className="header-actions">
        <div className="cart-icon" onClick={toggleCart} role="button" aria-label="Abrir carrinho" tabIndex={0}>
          🛒
          <span className="cart-count" id="cart-count">{getTotalItems()}</span>
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, color: "var(--gray-text)" }}>{user.full_name.split(" ")[0]}</span>
            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: "8px 16px", fontSize: 14 }}>
              Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn">Entrar</Link>
        )}

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} role="button" aria-label="Menu">
          ☰
        </div>
      </div>
    </header>
  );
}
