import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Category, Product } from "@/types";
import { ImageUploader, type ImageItem } from "./ImageUploader";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  image_urls: string[];
  cover_index: number;
  categories: string[];
  is_featured: boolean;
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
  const [images, setImages] = useState<ImageItem[]>(() => {
    if (!initial) return [];
    return initial.image_urls.map((url, i) => ({
      url,
      isCover: i === (initial.cover_index ?? 0),
    }));
  });
  const [discountPrice, setDiscountPrice] = useState(initial?.discount_price?.toString() ?? "");
  const [discountError, setDiscountError] = useState("");
  const [stock, setStock] = useState(initial?.stock?.toString() ?? "0");
  const [selectedCats, setSelectedCats] = useState<string[]>(initial?.categories ?? []);
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
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
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discountPrice ? parseFloat(discountPrice) : null;
    if (parsedDiscount !== null && parsedDiscount >= parsedPrice) {
      setDiscountError("O preço com desconto deve ser menor que o preço original");
      return;
    }
    setDiscountError("");
    setLoading(true);
    const coverIdx = images.findIndex((i) => i.isCover);
    try {
      await onSubmit({
        name,
        description,
        price: parsedPrice,
        discount_price: parsedDiscount,
        stock: parseInt(stock, 10) || 0,
        image_urls: images.map((i) => i.url),
        cover_index: coverIdx >= 0 ? coverIdx : 0,
        categories: selectedCats,
        is_featured: isFeatured,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "var(--border-thick)",
    borderRadius: 8,
    fontFamily: "inherit",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} placeholder="Nome do produto" style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o produto em detalhes..."
          rows={4}
          maxLength={2000}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <span style={{ fontSize: 11, color: "var(--gray-text)" }}>{description.length}/2000</span>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Preço (R$)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0.01" step="0.01" placeholder="45.00" style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
          Preço com desconto (R$) <span style={{ fontWeight: 400, color: "var(--gray-text)", fontSize: 12 }}>opcional</span>
        </label>
        <input
          type="number"
          value={discountPrice}
          onChange={(e) => { setDiscountPrice(e.target.value); setDiscountError(""); }}
          min="0.01"
          step="0.01"
          placeholder="Deixe vazio para sem desconto"
          style={inputStyle}
        />
        {discountError && <span style={{ fontSize: 12, color: "var(--primary-red)" }}>{discountError}</span>}
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Quantidade em estoque</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" step="1" placeholder="0" style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Fotos {images.length === 0 && <span style={{ color: "var(--primary-red)", fontSize: 12 }}>*</span>}
        </label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Categorias</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {availableCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => toggleCat(cat.slug)}
              className={"tab-btn" + (selectedCats.includes(cat.slug) ? " active" : "")}
            >
              {cat.name}
            </button>
          ))}
          {availableCategories.length === 0 && (
            <span style={{ color: "var(--gray-text)", fontSize: 13 }}>Crie categorias primeiro</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          id="is_featured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          style={{ width: 18, height: 18, cursor: "pointer" }}
        />
        <label htmlFor="is_featured" style={{ fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
          Produto em destaque (aparece na página inicial)
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="submit"
          className="btn"
          style={{ flex: 1 }}
          disabled={loading || selectedCats.length === 0 || images.length === 0}
        >
          {loading ? "Salvando..." : initial ? "Atualizar" : "Criar"}
        </button>
        <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
