import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";

const VALID_COUPON = "DESCONTO10";

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);

  function handleApplyCoupon(e) {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === VALID_COUPON) {
      setDiscount(subtotal * 0.1);
      setCouponMsg("Cupom aplicado! 10% de desconto.");
    } else {
      setDiscount(0);
      setCouponMsg("Cupom inválido.");
    }
  }

  const total = subtotal - discount;

  return (
    <>
      <section id="page-header" className="about-header">
        <h2>#Seu Carrinho</h2>
        <p>Revise seus itens antes de finalizar a compra</p>
      </section>

      <section id="Carrinho" className="section-p1">
        {items.length === 0 ? (
          <div className="empty-cart">
            <h3>Seu carrinho está vazio</h3>
            <p>
              Que tal dar uma olhada nos nossos produtos?{" "}
              <Link to="/shop">Ir para a loja</Link>
            </p>
          </div>
        ) : (
          <table width="100%">
            <thead>
              <tr>
                <td>Remover</td>
                <td>Imagem</td>
                <td>Produto</td>
                <td>Preço</td>
                <td>Quantidade</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remover ${item.name}`}
                    >
                      <FaTimesCircle />
                    </button>
                  </td>
                  <td>
                    <img src={item.img} alt={item.name} />
                  </td>
                  <td>{item.name}</td>
                  <td>R${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td>R${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {items.length > 0 && (
        <section id="cart-add" className="section-p1">
          <div id="coupon">
            <h3>Adicione o cupom</h3>
            <form onSubmit={handleApplyCoupon} style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Seu Cupom (tente DESCONTO10)"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button className="normal" type="submit">
                Adicionar
              </button>
            </form>
            {couponMsg && <p className="coupon-msg">{couponMsg}</p>}
          </div>

          <div id="subtotal">
            <h3>Total do Carrinho</h3>
            <table>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>R${subtotal.toFixed(2)}</td>
                </tr>
                {discount > 0 && (
                  <tr>
                    <td>Desconto</td>
                    <td>- R${discount.toFixed(2)}</td>
                  </tr>
                )}
                <tr>
                  <td>Envio</td>
                  <td>Grátis</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>R${total.toFixed(2)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="normal" onClick={() => alert("Checkout simulado — compra finalizada!")}>
              Fazer o Check-out
            </button>
          </div>
        </section>
      )}
    </>
  );
}
