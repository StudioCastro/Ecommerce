import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <section className="section-p1">
      <h2>Painel Administrativo</h2>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Link to="/admin/products">
          <button className="normal">Produtos</button>
        </Link>
        <Link to="/admin/orders">
          <button className="normal">Pedidos</button>
        </Link>
      </div>
    </section>
  );
}
