import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// location.state.from vem de ProtectedRoute (guarda a rota que o usuário tentava acessar).
// Nunca repassamos esse valor direto pra navigate(): um link malicioso com barra invertida
// (ex.: "/\\evil.com/x") pode ser interpretado pelo navegador como URL protocol-relative
// ("//evil.com"), redirecionando o usuário pra fora do site logo após o login (open redirect
// — vetor conhecido de phishing, agravado pelo CVE-2025-68470 do react-router). Só aceitamos
// caminhos internos: uma única barra no início, sem esquema (":") e sem barra invertida.
function sanitizeRedirect(path) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") || /[\\:]/.test(path)) {
    return "/";
  }
  return path;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = sanitizeRedirect(location.state?.from);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="form-details" style={{ justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px" }}>
        <span>ENTRAR</span>
        <h2>Acesse sua conta</h2>
        {error && <p className="coupon-msg">{error}</p>}
        <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="normal" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p style={{ marginTop: "15px" }}>
          Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </form>
    </section>
  );
}
