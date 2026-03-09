import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Product } from "@/types";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);

  const load = async () => {
    const res = await api.get<Product[]>("/products");
    setProducts(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: object) => {
    await api.post("/products", data);
    toast.success("Produto criado!");
    setEditing(undefined);
    load();
  };

  const handleUpdate = async (data: object) => {
    if (!editing) return;
    await api.put(`/products/${editing.id}`, data);
    toast.success("Produto atualizado!");
    setEditing(undefined);
    load();
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    await api.delete(`/products/${p.id}`);
    toast.success("Produto excluído!");
    load();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Produtos</h1>
        <button className="btn" onClick={() => setEditing(null)}>+ Novo Produto</button>
      </div>

      {editing !== undefined && (
        <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24, marginBottom: 24, boxShadow: "var(--shadow-dark)" }}>
          <h3 style={{ marginBottom: 16 }}>{editing ? "Editar Produto" : "Novo Produto"}</h3>
          <ProductForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => setEditing(undefined)}
          />
        </div>
      )}

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24 }}>
        <ProductTable products={products} onEdit={(p) => setEditing(p)} onDelete={handleDelete} />
      </div>
    </div>
  );
}
