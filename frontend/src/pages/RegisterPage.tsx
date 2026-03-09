import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, fullName);
      await login(email, password);
      toast.success("Conta criada com sucesso!");
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(typeof msg === "string" ? msg : "Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-color)" }}>
      <div style={{ background: "var(--white)", border: "var(--border-thick)", borderRadius: "var(--border-radius)", padding: "40px", width: "100%", maxWidth: 400, boxShadow: "var(--shadow-red)" }}>
        <h2 style={{ marginBottom: 24, fontSize: 28 }}>🐾 Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Nome completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
              placeholder="João Silva"
              style={{ width: "100%", padding: "10px 14px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              style={{ width: "100%", padding: "10px 14px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres, maiúscula, número e especial"
              style={{ width: "100%", padding: "10px 14px", border: "var(--border-thick)", borderRadius: 8, fontSize: 14 }}
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%", textAlign: "center" }} disabled={loading}>
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>
        </form>
        <p style={{ marginTop: 20, textAlign: "center", fontSize: 14, color: "var(--gray-text)" }}>
          Já tem conta?{" "}
          <Link to="/login" style={{ color: "var(--primary-red)", fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
