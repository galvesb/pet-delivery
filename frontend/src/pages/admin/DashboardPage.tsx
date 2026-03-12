import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";

export function DashboardPage() {
  const [counts, setCounts] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/products").then((r) => r.data.length),
      api.get("/categories").then((r) => r.data.length),
    ]).then(([products, categories]) => setCounts({ products, categories })).catch(() => {});
  }, []);

  const cardStyle = {
    background: "var(--white)",
    border: "var(--border-thick)",
    borderRadius: "var(--border-radius)",
    padding: 32,
    boxShadow: "var(--shadow-dark)",
    textAlign: "center" as const,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Painel Admin</h1>
      <p style={{ color: "var(--gray-text)", marginBottom: 40 }}>Gerencie categorias e produtos do HomePet.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginBottom: 40 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, color: "var(--primary-red)", fontWeight: 700 }}>{counts.products}</div>
          <div style={{ fontSize: 16, marginTop: 8, color: "var(--gray-text)" }}>Produtos</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, color: "var(--primary-red)", fontWeight: 700 }}>{counts.categories}</div>
          <div style={{ fontSize: 16, marginTop: 8, color: "var(--gray-text)" }}>Categorias</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        <Link to="/admin/products" className="btn" style={{ textAlign: "center" }}>
          Gerenciar Produtos
        </Link>
        <Link to="/admin/categories" className="btn btn-outline" style={{ textAlign: "center" }}>
          Gerenciar Categorias
        </Link>
        <Link to="/admin/banners" className="btn btn-outline" style={{ textAlign: "center" }}>
          Gerenciar Banners
        </Link>
        <Link to="/admin/brands" className="btn btn-outline" style={{ textAlign: "center" }}>
          Gerenciar Marcas
        </Link>
        <Link to="/admin/faqs" className="btn btn-outline" style={{ textAlign: "center" }}>
          Gerenciar FAQ
        </Link>
      </div>
    </div>
  );
}
