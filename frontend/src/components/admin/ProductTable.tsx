import type { Product } from "@/types";

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, minWidth: 480 }}>
        <thead>
          <tr style={{ borderBottom: "var(--border-thick)" }}>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>Nome</th>
            <th style={{ textAlign: "left", padding: "8px 12px" }}>Preço</th>
            <th className="admin-col-hide-mobile" style={{ textAlign: "left", padding: "8px 12px" }}>Categorias</th>
            <th style={{ textAlign: "right", padding: "8px 12px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px 12px" }}>{p.name}</td>
              <td style={{ padding: "10px 12px", color: "var(--primary-red)", fontWeight: 700, whiteSpace: "nowrap" }}>
                R$ {p.price.toFixed(2).replace(".", ",")}
              </td>
              <td className="admin-col-hide-mobile" style={{ padding: "10px 12px" }}>
                {p.categories.map((cat) => (
                  <span key={cat} style={{ background: "#eee", borderRadius: 4, padding: "2px 8px", fontSize: 12, marginRight: 4 }}>
                    {cat}
                  </span>
                ))}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13, marginRight: 8 }} onClick={() => onEdit(p)}>
                  Editar
                </button>
                <button
                  style={{ padding: "6px 12px", fontSize: 13, border: "2px solid var(--dark)", borderRadius: 8, cursor: "pointer", background: "white", fontWeight: 600 }}
                  onClick={() => onDelete(p)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--gray-text)" }}>
                Nenhum produto cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
