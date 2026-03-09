import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Category, Product } from "@/types";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  categories: string[];
}

interface Props {
  initial?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [selectedCats, setSelectedCats] = useState<string[]>(initial?.categories ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Category[]>("/categories").then((res) => setAvailableCategories(res.data)).catch(() => {});
  }, []);

  const toggleCat = (slug: string) => {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, description, price: parseFloat(price), image_url: imageUrl, categories: selectedCats });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "8px 12px", border: "var(--border-thick)", borderRadius: 8 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} placeholder="Nome do produto" style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Descrição</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição" style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Preço (R$)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0.01" step="0.01" placeholder="45.00" style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>URL da Imagem</label>
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required placeholder="https://..." style={inputStyle} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Categorias</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {availableCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => toggleCat(cat.slug)}
              className={`tab-btn${selectedCats.includes(cat.slug) ? " active" : ""}`}
            >
              {cat.name}
            </button>
          ))}
          {availableCategories.length === 0 && (
            <span style={{ color: "var(--gray-text)", fontSize: 13 }}>Crie categorias primeiro</span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading || selectedCats.length === 0}>
          {loading ? "Salvando..." : initial ? "Atualizar" : "Criar"}
        </button>
        <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
