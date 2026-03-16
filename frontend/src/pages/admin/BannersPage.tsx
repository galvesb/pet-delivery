import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Banner } from "@/types";

export function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get<Banner[]>("/banners/all");
    setBanners(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (b: Banner) => {
    if (!confirm(`Excluir banner "${b.title}"?`)) return;
    await api.delete(`/banners/${b.id}`);
    toast.success("Banner excluído!");
    load();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Banners</h1>
        <button className="btn" onClick={() => navigate("/admin/banners/new")}>+ Novo Banner</button>
      </div>

      <div className="admin-table-wrap" style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24 }}>
        {banners.length === 0 ? (
          <p style={{ color: "var(--gray-text)", textAlign: "center", padding: "40px 0" }}>
            Nenhum banner cadastrado.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--dark)" }}>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Preview</th>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Título</th>
                <th style={{ textAlign: "center", padding: "8px 12px" }}>Ativo</th>
                <th style={{ textAlign: "center", padding: "8px 12px" }}>Ordem</th>
                <th style={{ textAlign: "right", padding: "8px 12px" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        backgroundColor: b.bg_color,
                        color: b.text_color,
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        display: "inline-block",
                      }}
                    >
                      {b.title}
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    {b.subtitle && <div style={{ fontSize: 12, color: "var(--gray-text)" }}>{b.subtitle}</div>}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {b.is_active ? "✅" : "❌"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>{b.order}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/admin/banners/${b.id}/edit`)}
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
