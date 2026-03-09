import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface Props {
  category: string;
}

export function ProductGrid({ category }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (category !== "todos") params.category = category;

    api
      .get<Product[]>("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray-text)" }}>
        Carregando produtos...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray-text)" }}>
        Nenhum produto encontrado nesta categoria.
      </div>
    );
  }

  return (
    <div className="product-grid" id="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
