import { useState, useEffect, useRef } from "react";
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
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navRef.current && !navRef.current.contains(e.target as Node) &&
        toggleRef.current && !toggleRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header>
      <div className="header-inner container">
      <div ref={toggleRef} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} role="button" aria-label="Menu">
        ☰
      </div>

      <div className="logo">
        <Link to="/" style={{ color: "var(--primary-red)", fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", gap: 8 }}>
          🐾 HomePet
        </Link>
      </div>

      <nav ref={navRef}>
        <ul className={`nav-links${menuOpen ? " active" : ""}`} id="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Início</Link></li>
          <li><a href="/#servicos" onClick={() => setMenuOpen(false)}>Serviços</a></li>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Produtos</Link></li>
          {user?.role === "ADMIN" && (
            <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
          )}
          {user ? (
            <li className="nav-auth-item">
              <a onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ cursor: "pointer" }}>
                Sair
              </a>
            </li>
          ) : (
            <li className="nav-auth-item">
              <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="header-actions">
        <div className="cart-icon" onClick={toggleCart} role="button" aria-label="Abrir carrinho" tabIndex={0}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span className="cart-count" id="cart-count">{getTotalItems()}</span>
        </div>

        {user ? (
          <div className="header-user-info" style={{ display: "flex", alignItems: "center" }}>
            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: "8px 16px", fontSize: 14 }}>
              Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn">Entrar</Link>
        )}
      </div>
      </div>
    </header>
  );
}
