import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form.name, form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="form-details" style={{ justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px" }}>
        <span>CRIAR CONTA</span>
        <h2>Cadastre-se</h2>
        {error && <p className="coupon-msg">{error}</p>}
        <input type="text" name="name" placeholder="Seu Nome" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
        <input
          type="password"
          name="password"
          placeholder="Senha (mín. 8 caracteres)"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required
        />
        <button className="normal" type="submit" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
        <p style={{ marginTop: "15px" }}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}
