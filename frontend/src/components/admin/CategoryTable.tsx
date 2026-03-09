import type { Category } from "@/types";

interface Props {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr style={{ borderBottom: "var(--border-thick)" }}>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Nome</th>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Slug</th>
          <th style={{ textAlign: "right", padding: "8px 12px" }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "10px 12px" }}>{cat.name}</td>
            <td style={{ padding: "10px 12px", color: "var(--gray-text)", fontFamily: "monospace" }}>{cat.slug}</td>
            <td style={{ padding: "10px 12px", textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => onEdit(cat)}>
                Editar
              </button>
              <button
                style={{ padding: "6px 12px", fontSize: 13, border: "2px solid var(--dark)", borderRadius: 8, cursor: "pointer", background: "white", fontWeight: 600 }}
                onClick={() => onDelete(cat)}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
        {categories.length === 0 && (
          <tr>
            <td colSpan={3} style={{ textAlign: "center", padding: 24, color: "var(--gray-text)" }}>
              Nenhuma categoria cadastrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
