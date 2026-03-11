import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Banner } from "@/types";

interface BannerFormData {
  title: string;
  subtitle: string;
  bg_color: string;
  text_color: string;
  link_url: string;
  link_text: string;
  order: number;
  is_active: boolean;
}

const defaultForm: BannerFormData = {
  title: "",
  subtitle: "",
  bg_color: "#FF6B35",
  text_color: "#FFFFFF",
  link_url: "",
  link_text: "",
  order: 0,
  is_active: true,
};

export function BannerFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<BannerFormData>(defaultForm);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!id) return;
    api.get<Banner>(`/banners/${id}`).then((res) => {
      const b = res.data;
      setForm({
        title: b.title,
        subtitle: b.subtitle,
        bg_color: b.bg_color,
        text_color: b.text_color,
        link_url: b.link_url,
        link_text: b.link_text,
        order: b.order,
        is_active: b.is_active,
      });
      setLoading(false);
    }).catch(() => {
      toast.error("Banner não encontrado");
      navigate("/admin/banners");
    });
  }, [id, navigate]);

  const set = (field: keyof BannerFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await api.put(`/banners/${id}`, form);
      toast.success("Banner atualizado!");
    } else {
      await api.post("/banners", form);
      toast.success("Banner criado!");
    }
    navigate("/admin/banners");
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px", textAlign: "center", color: "var(--gray-text)" }}>
        Carregando banner...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate("/admin/banners")}
        style={{ marginBottom: 24, padding: "8px 16px", fontSize: 14 }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        {isEditing ? "Editar Banner" : "Novo Banner"}
      </h1>

      {/* Preview ao vivo */}
      <div
        style={{
          backgroundColor: form.bg_color,
          color: form.text_color,
          padding: "12px 24px",
          borderRadius: "var(--border-radius)",
          border: "var(--border-thick)",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          minHeight: 48,
        }}
      >
        <strong>{form.title || "Título do Banner"}</strong>
        {form.subtitle && <span style={{ opacity: 0.9, fontSize: 14 }}>{form.subtitle}</span>}
        {form.link_text && (
          <span style={{
            backgroundColor: form.text_color,
            color: form.bg_color,
            padding: "4px 12px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
          }}>
            {form.link_text}
          </span>
        )}
      </div>

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24, boxShadow: "var(--shadow-dark)" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              minLength={2}
              maxLength={200}
              style={{ width: "100%", padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Subtítulo</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              maxLength={500}
              style={{ width: "100%", padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Cor de fundo</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="color"
                  value={form.bg_color}
                  onChange={(e) => set("bg_color", e.target.value)}
                  style={{ width: 48, height: 40, border: "var(--border-thick)", borderRadius: 8, cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={form.bg_color}
                  onChange={(e) => set("bg_color", e.target.value)}
                  style={{ flex: 1, padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Cor do texto</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="color"
                  value={form.text_color}
                  onChange={(e) => set("text_color", e.target.value)}
                  style={{ width: 48, height: 40, border: "var(--border-thick)", borderRadius: 8, cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={form.text_color}
                  onChange={(e) => set("text_color", e.target.value)}
                  style={{ flex: 1, padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Link URL</label>
              <input
                type="text"
                value={form.link_url}
                onChange={(e) => set("link_url", e.target.value)}
                placeholder="/products"
                maxLength={500}
                style={{ width: "100%", padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Texto do botão</label>
              <input
                type="text"
                value={form.link_text}
                onChange={(e) => set("link_text", e.target.value)}
                placeholder="Ver mais"
                maxLength={100}
                style={{ width: "100%", padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Ordem</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                min={0}
                style={{ width: "100%", padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <label htmlFor="is_active" style={{ fontWeight: 600, cursor: "pointer" }}>Banner ativo</label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn">{isEditing ? "Salvar alterações" : "Criar banner"}</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/banners")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
