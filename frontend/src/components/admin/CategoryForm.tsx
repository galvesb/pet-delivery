import { useEffect, useState } from "react";
import type { Category } from "@/types";

interface Props {
  initial?: Category | null;
  onSubmit: (data: { name: string; slug: string }) => Promise<void>;
  onCancel: () => void;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function CategoryForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initial) {
      setSlug(toSlug(name));
    }
  }, [name, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, slug });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          placeholder="Para Cachorros"
          style={{ width: "100%", padding: "8px 12px", border: "var(--border-thick)", borderRadius: 8 }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          minLength={2}
          placeholder="cachorro"
          pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
          style={{ width: "100%", padding: "8px 12px", border: "var(--border-thick)", borderRadius: 8, fontFamily: "monospace" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
          {loading ? "Salvando..." : initial ? "Atualizar" : "Criar"}
        </button>
        <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
