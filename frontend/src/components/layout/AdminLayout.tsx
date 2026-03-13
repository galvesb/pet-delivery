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
