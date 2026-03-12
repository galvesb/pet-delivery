import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/api/client";
import type { FaqItem } from "@/types";

interface FaqFormData {
  question: string;
  answer: string;
  is_active: boolean;
}

const defaultForm: FaqFormData = {
  question: "",
  answer: "",
  is_active: true,
};

export function FaqFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<FaqFormData>(defaultForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get<FaqItem>(`/faqs/${id}`).then((res) => {
      const f = res.data;
      setForm({ question: f.question, answer: f.answer, is_active: f.is_active });
      setLoading(false);
    }).catch(() => {
      navigate("/admin/faqs");
    });
  }, [id, navigate]);

  const set = (field: keyof FaqFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.question.trim()) { setError("A pergunta é obrigatória."); return; }
    if (!form.answer.trim()) { setError("A resposta é obrigatória."); return; }
    setSaving(true);
    try {
      if (isEditing) {
        await api.patch(`/faqs/${id}`, form);
      } else {
        await api.post("/faqs", form);
      }
      navigate("/admin/faqs");
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Erro ao salvar. Verifique os dados.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "var(--border-thick)",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px", textAlign: "center", color: "var(--gray-text)" }}>
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate("/admin/faqs")}
        style={{ marginBottom: 24, padding: "8px 16px", fontSize: 14 }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        {isEditing ? "Editar Pergunta" : "Nova Pergunta"}
      </h1>

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24, boxShadow: "var(--shadow-dark)" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Pergunta *</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
              required
              maxLength={500}
              placeholder="Ex: Faz entrega no mesmo dia?"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Resposta *</label>
            <textarea
              value={form.answer}
              onChange={(e) => set("answer", e.target.value)}
              required
              maxLength={2000}
              rows={5}
              placeholder="Ex: Sim! Pedidos realizados até as 17h são entregues no mesmo dia, de segunda a sábado."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <label htmlFor="is_active" style={{ fontWeight: 600, cursor: "pointer" }}>Pergunta ativa (visível na home)</label>
          </div>

          {error && (
            <p style={{ color: "#dc2626", marginBottom: 16, fontSize: 14 }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar pergunta"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/faqs")} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
