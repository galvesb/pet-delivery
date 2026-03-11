import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Product } from "@/types";
import { ProductForm } from "@/components/admin/ProductForm";

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [initial, setInitial] = useState<Product | null | undefined>(isEditing ? undefined : null);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!id) return;
    api
      .get<Product>(`/products/${id}`)
      .then((res) => {
        setInitial(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Produto não encontrado");
        navigate("/admin/products");
      });
  }, [id, navigate]);

  const handleSubmit = async (data: object) => {
    if (isEditing) {
      await api.put(`/products/${id}`, data);
      toast.success("Produto atualizado!");
    } else {
      await api.post("/products", data);
      toast.success("Produto criado!");
    }
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px", color: "var(--gray-text)", textAlign: "center" }}>
        Carregando produto...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate("/admin/products")}
        style={{ marginBottom: 24, padding: "8px 16px", fontSize: 14 }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        {isEditing ? "Editar Produto" : "Novo Produto"}
      </h1>

      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24, boxShadow: "var(--shadow-dark)" }}>
        <ProductForm
          initial={initial}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/products")}
        />
      </div>
    </div>
  );
}
