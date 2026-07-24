import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api.js";
import { ORDER_STATUS_LABELS } from "../utils/orderStatus.js";

const RESULT_HEADINGS = {
  success: "Pagamento em processamento!",
  failure: "Não foi possível concluir o pagamento",
  pending: "Pagamento pendente",
};

export default function OrderStatus() {
  const { id, result } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <section className="section-p1" style={{ textAlign: "center" }}>
      <h2>{RESULT_HEADINGS[result] ?? "Pedido realizado"}</h2>

      {loading && <p>Carregando status do pedido...</p>}
      {error && <p>{error}</p>}

      {order && (
        <div style={{ margin: "20px 0" }}>
          <p>Pedido #{order.id.slice(0, 8)}</p>
          <p>Status: {ORDER_STATUS_LABELS[order.status] ?? order.status}</p>
          <p>Total: R${order.total.toFixed(2)}</p>
          {!order.payment && (
            <p>Este pedido ainda não tem pagamento iniciado (o link do Mercado Pago não pôde ser gerado).</p>
          )}
        </div>
      )}

      <Link to="/shop">
        <button className="normal">Continuar comprando</button>
      </Link>
    </section>
  );
}
