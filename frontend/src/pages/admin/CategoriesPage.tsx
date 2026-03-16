import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import type { Category } from "@/types";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { CategoryForm } from "@/components/admin/CategoryForm";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null | undefined>(undefined);

  const load = async () => {
    const res = await api.get<Category[]>("/categories");
    setCategories(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: { name: string; slug: string }) => {
    await api.post("/categories", data);
    toast.success("Categoria criada!");
    setEditing(undefined);
    load();
  };

  const handleUpdate = async (data: { name: string; slug: string }) => {
    if (!editing) return;
    await api.put(`/categories/${editing.id}`, data);
    toast.success("Categoria atualizada!");
    setEditing(undefined);
    load();
  };

  const handleDelete = async (cat: Category) => {
    try {
      await api.delete(`/categories/${cat.id}`);
      toast.success("Categoria excluída!");
      load();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      if (detail && typeof detail === "object" && "products" in detail) {
        const d = detail as { message: string; products: string[] };
        const productList = d.products.join(", ");
        toast.warning(
          `Não é possível excluir. ${d.products.length} produto(s) usam esta categoria: ${productList}`,
          { duration: 6000 }
        );
      } else {
        toast.error("Erro ao excluir categoria.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Categorias</h1>
        <button className="btn" onClick={() => setEditing(null)}>+ Nova Categoria</button>
      </div>

      {editing !== undefined && (
        <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24, marginBottom: 24, boxShadow: "var(--shadow-dark)" }}>
          <h3 style={{ marginBottom: 16 }}>{editing ? "Editar Categoria" : "Nova Categoria"}</h3>
          <CategoryForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => setEditing(undefined)}
          />
        </div>
      )}

      <div className="admin-table-wrap" style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: 24 }}>
        <CategoryTable
          categories={categories}
          onEdit={(cat) => setEditing(cat)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
