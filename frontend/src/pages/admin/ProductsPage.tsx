import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Product } from "@/types";
import { ProductTable } from "@/components/admin/ProductTable";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get<{ items: Product[]; total: number }>("/products", { params: { limit: 100 } });
    setProducts(res.data.items);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (p: Product) => {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    await api.delete(`/products/${p.id}`);
    toast.success("Produto excluído!");
    load();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Produtos</h1>
        <button className="btn" onClick={() => navigate("/admin/products/new")}>+ Novo Produto</button>
      </div>

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24 }}>
        <ProductTable
          products={products}
          onEdit={(p) => navigate(`/admin/products/${p.id}/edit`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
