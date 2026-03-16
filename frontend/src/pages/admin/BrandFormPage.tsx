import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Brand } from "@/types";

interface BrandFormData {
  name: string;
  logo_url: string;
  order: number;
  is_active: boolean;
}

const defaultForm: BrandFormData = {
  name: "",
  logo_url: "",
  order: 0,
  is_active: true,
};

export function BrandFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<BrandFormData>(defaultForm);
  const [loading, setLoading] = useState(isEditing);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Brand>(`/brands/${id}`).then((res) => {
      const b = res.data;
      setForm({ name: b.name, logo_url: b.logo_url, order: b.order, is_active: b.is_active });
      setLoading(false);
    }).catch(() => {
      toast.error("Marca não encontrada");
      navigate("/admin/brands");
    });
  }, [id, navigate]);

  const set = (field: keyof BrandFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await api.post<{ urls: string[] }>("/uploads/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set("logo_url", res.data.urls[0]);
    } catch {
      toast.error("Erro ao fazer upload do logo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.logo_url) {
      toast.error("Adicione um logo para a marca");
      return;
    }
    if (isEditing) {
      await api.put(`/brands/${id}`, form);
      toast.success("Marca atualizada!");
    } else {
      await api.post("/brands", form);
      toast.success("Marca criada!");
    }
    navigate("/admin/brands");
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px", textAlign: "center", color: "var(--gray-text)" }}>
        Carregando marca...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate("/admin/brands")}
        style={{ marginBottom: 24, padding: "8px 16px", fontSize: 14 }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        {isEditing ? "Editar Marca" : "Nova Marca"}
      </h1>

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24, boxShadow: "var(--shadow-dark)" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Nome da marca *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              minLength={2}
              maxLength={100}
              style={{ width: "100%", padding: "10px 12px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Logo *</label>
            {form.logo_url && (
              <div style={{ marginBottom: 12, padding: 12, border: "var(--border-thick)", borderRadius: 8, display: "inline-block" }}>
                <img
                  src={form.logo_url}
                  alt="Logo preview"
                  style={{ maxHeight: 80, maxWidth: 200, objectFit: "contain" }}
                />
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                {uploading ? "Enviando..." : form.logo_url ? "Trocar logo" : "Selecionar logo"}
              </button>
            </div>
          </div>

          <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
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
              <label htmlFor="is_active" style={{ fontWeight: 600, cursor: "pointer" }}>Marca ativa</label>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn">{isEditing ? "Salvar alterações" : "Criar marca"}</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/brands")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
