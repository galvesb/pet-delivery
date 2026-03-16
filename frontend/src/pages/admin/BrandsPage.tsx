import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Brand } from "@/types";

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get<Brand[]>("/brands/all");
    setBrands(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (b: Brand) => {
    if (!confirm(`Excluir marca "${b.name}"?`)) return;
    await api.delete(`/brands/${b.id}`);
    toast.success("Marca excluída!");
    load();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Marcas Parceiras</h1>
        <button className="btn" onClick={() => navigate("/admin/brands/new")}>+ Nova Marca</button>
      </div>

      <div className="admin-table-wrap" style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24 }}>
        {brands.length === 0 ? (
          <p style={{ color: "var(--gray-text)", textAlign: "center", padding: "40px 0" }}>
            Nenhuma marca cadastrada.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--dark)" }}>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Logo</th>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Nome</th>
                <th style={{ textAlign: "center", padding: "8px 12px" }}>Ativo</th>
                <th style={{ textAlign: "center", padding: "8px 12px" }}>Ordem</th>
                <th style={{ textAlign: "right", padding: "8px 12px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    <img
                      src={b.logo_url}
                      alt={b.name}
                      className="admin-brand-logo-thumb"
                    />
                  </td>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{b.name}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {b.is_active ? "✅" : "❌"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>{b.order}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/admin/brands/${b.id}/edit`)}
                      style={{ marginRight: 8, padding: "6px 12px", fontSize: 13 }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(b)}
                      style={{ padding: "6px 12px", fontSize: 13, backgroundColor: "#dc2626" }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
