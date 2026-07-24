import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { ORDER_STATUS_LABELS } from "../../utils/orderStatus.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-p1">
      <h2>Meus Pedidos</h2>

      {loading && <p>Carregando pedidos...</p>}

      {!loading && orders.length === 0 && (
        <p>
          Você ainda não fez nenhum pedido. <Link to="/shop">Ir para a loja</Link>
        </p>
      )}

      {orders.length > 0 && (
        <table width="100%">
          <thead>
            <tr>
              <td>Pedido</td>
              <td>Data</td>
              <td>Status</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link to={`/order/${o.id}`}>#{o.id.slice(0, 8)}</Link>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("pt-BR")}</td>
                <td>{ORDER_STATUS_LABELS[o.status] ?? o.status}</td>
                <td>R${o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
