import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import type { FaqItem } from "@/types";

export function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const navigate = useNavigate();
  const dragIndex = useRef<number | null>(null);

  const load = async () => {
    const res = await api.get<FaqItem[]>("/faqs/all");
    setFaqs(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (faq: FaqItem) => {
    if (!confirm(`Excluir a pergunta "${faq.question}"?`)) return;
    await api.delete(`/faqs/${faq.id}`);
    load();
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === targetIndex) return;
    const reordered = [...faqs];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(targetIndex, 0, moved);
    dragIndex.current = null;
    setFaqs(reordered);
    await api.patch("/faqs/reorder", { ids: reordered.map((f) => f.id) });
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Perguntas Frequentes (FAQ)</h1>
        <button className="btn" onClick={() => navigate("/admin/faqs/new")}>+ Nova Pergunta</button>
      </div>

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24 }}>
        {faqs.length === 0 ? (
          <p style={{ color: "var(--gray-text)", textAlign: "center", padding: "40px 0" }}>
            Nenhuma pergunta cadastrada.
          </p>
        ) : (
          <div>
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 0",
                  borderBottom: index < faqs.length - 1 ? "1px solid #eee" : "none",
                  cursor: "grab",
                }}
              >
                <span style={{ fontSize: 20, color: "var(--gray-text)", paddingTop: 2, userSelect: "none" }}>≡</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {faq.question}
                    {!faq.is_active && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: "var(--gray-text)", fontWeight: 400 }}>
                        (inativo)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gray-text)", whiteSpace: "pre-wrap" }}>
                    {faq.answer}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(`/admin/faqs/${faq.id}`)}
                    style={{ padding: "6px 12px", fontSize: 13 }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleDelete(faq)}
                    style={{ padding: "6px 12px", fontSize: 13, backgroundColor: "#dc2626" }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
