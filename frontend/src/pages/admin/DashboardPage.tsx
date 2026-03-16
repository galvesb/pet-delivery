import { useEffect, useState } from "react";
import { api } from "@/api/client";

const pedidos = [
  { id: "#1042", cliente: "Maria Silva", itens: "Ração Premium 15kg, Coleira M", valor: "R$ 189,90", status: "Novo", hora: "12:53" },
  { id: "#1041", cliente: "João Santos", itens: "Shampoo Antipulgas, Brinquedo", valor: "R$ 67,80", status: "Preparando", hora: "12:30" },
  { id: "#1040", cliente: "Ana Oliveira", itens: "Ração Gatos 10kg", valor: "R$ 124,90", status: "Saiu para entrega", hora: "11:45" },
  { id: "#1039", cliente: "Carlos Lima", itens: "Casinha Pet Grande", valor: "R$ 299,00", status: "Novo", hora: "11:20" },
  { id: "#1038", cliente: "Fernanda Costa", itens: "Vitaminas, Petisco Natural", valor: "R$ 45,50", status: "Entregue", hora: "10:15" },
];

const agendaHoje = [
  { horario: "10:00", servico: "Banho e Tosa", pet: "Bella" },
  { horario: "14:30", servico: "Consulta Vet.", pet: "Rex" },
  { horario: "16:00", servico: "Banho", pet: "Luna" },
];

export function DashboardPage() {
  const [counts, setCounts] = useState({ products: 0, categories: 0, brands: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { limit: 1 } }).then((r) => r.data.total ?? 0),
      api.get("/categories").then((r) => r.data.length),
      api.get("/brands").then((r) => r.data.length),
    ]).then(([products, categories, brands]) =>
      setCounts({ products, categories, brands })
    ).catch(() => {});
  }, []);

  const cardStyle = {
    background: "var(--white)",
    border: "var(--border-thick)",
    borderRadius: "var(--border-radius)",
    padding: 32,
    textAlign: "center" as const,
  };

  const sectionStyle = {
    background: "var(--white)",
    border: "var(--border-thick)",
    borderRadius: "var(--border-radius)",
    padding: 24,
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    "Novo": { bg: "var(--light-red)", color: "var(--primary-red)" },
    "Preparando": { bg: "#fff3e0", color: "#e65100" },
    "Saiu para entrega": { bg: "#e3f2fd", color: "#1565c0" },
    "Entregue": { bg: "#e6f9ee", color: "#1a7a3a" },
  };

  const statusStyle = (status: string) => ({
    fontSize: 12,
    fontWeight: 700 as const,
    padding: "2px 10px",
    borderRadius: 20,
    background: statusColors[status]?.bg ?? "#eee",
    color: statusColors[status]?.color ?? "#666",
    whiteSpace: "nowrap" as const,
  });

  return (
    <div style={{ padding: "40px 24px 48px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "var(--gray-text)", marginBottom: 32 }}>
        Gerencie categorias e produtos do HomePet.
      </p>

      {/* Cards de contagem */}
      <div className="admin-cards-grid" style={{ marginBottom: 32 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, color: "var(--primary-red)", fontWeight: 700 }}>{counts.products}</div>
          <div style={{ fontSize: 14, marginTop: 8, color: "var(--gray-text)" }}>Produtos</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, color: "var(--primary-red)", fontWeight: 700 }}>{counts.categories}</div>
          <div style={{ fontSize: 14, marginTop: 8, color: "var(--gray-text)" }}>Categorias</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 48, color: "var(--primary-red)", fontWeight: 700 }}>{counts.brands}</div>
          <div style={{ fontSize: 14, marginTop: 8, color: "var(--gray-text)" }}>Marcas</div>
        </div>
      </div>

      {/* Pedidos + Agenda do dia */}
      <div className="admin-dashboard-grid">
        {/* Últimos Pedidos */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 700 }}>Pedidos</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pedidos.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < pedidos.length - 1 ? "1px solid #eee" : "none",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--dark)" }}>{p.id}</span>
                    <span style={{ fontSize: 12, color: "var(--gray-text)" }}>{p.hora}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{p.cliente}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.itens}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>{p.valor}</div>
                  <span style={statusStyle(p.status)}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda do dia */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 700 }}>Hoje, 12 Mar</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {agendaHoje.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  borderRadius: "var(--border-radius)",
                  border: i === 1 ? "2px solid var(--primary-red)" : "1px solid #eee",
                  background: i === 1 ? "var(--light-red)" : "var(--white)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.servico}</div>
                <div style={{ fontSize: 13, color: "var(--gray-text)", marginTop: 4 }}>
                  {a.pet}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-text)", marginTop: 4 }}>
                  {a.horario}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
