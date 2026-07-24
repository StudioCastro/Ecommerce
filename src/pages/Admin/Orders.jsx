import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { ORDER_STATUS_LABELS } from "../../utils/orderStatus.js";

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .getAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id, status) {
    await api.updateOrderStatus(id, { status });
    load();
  }

  return (
    <section className="section-p1">
      <h2>Pedidos</h2>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido ainda.</p>
      ) : (
        <table width="100%">
          <thead>
            <tr>
              <td>Pedido</td>
              <td>Cliente</td>
              <td>Total</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id.slice(0, 8)}</td>
                <td>
                  {o.customer?.name}
                  <br />
                  <small>{o.customer?.email}</small>
                </td>
                <td>R${o.total.toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
