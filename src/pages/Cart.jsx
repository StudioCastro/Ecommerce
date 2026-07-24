import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import Newsletter from "../components/Newsletter.jsx";

const VALID_COUPON = "DESCONTO10";

const emptyAddressForm = {
  label: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .getAddresses()
      .then((list) => {
        setAddresses(list);
        const preferred = list.find((a) => a.isDefault) ?? list[0];
        if (preferred) setSelectedAddressId(preferred.id);
        setShowAddressForm(list.length === 0);
      })
      .catch(() => {});
  }, [user]);

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

  function handleAddressChange(e) {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  }

  async function handleSaveAddress(e) {
    e.preventDefault();
    setCheckoutError("");
    try {
      const created = await api.createAddress({
        ...addressForm,
        state: addressForm.state.toUpperCase(),
        isDefault: addresses.length === 0,
      });
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setAddressForm(emptyAddressForm);
    } catch (err) {
      setCheckoutError(err.message);
    }
  }

  async function handleCheckout() {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (!selectedAddressId) {
      setCheckoutError("Cadastre um endereço de entrega antes de finalizar.");
      setShowAddressForm(true);
      return;
    }

    setCheckingOut(true);
    setCheckoutError("");
    try {
      const { order, checkoutUrl } = await api.createOrder({
        items: items.map((i) => ({ productId: i.id, qty: i.qty })),
        addressId: selectedAddressId,
        couponCode: discount > 0 ? coupon.trim().toUpperCase() : undefined,
      });
      clearCart();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate(`/order/${order.id}`);
      }
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setCheckingOut(false);
    }
  }

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

            {user && addresses.length > 0 && !showAddressForm && (
              <div style={{ margin: "15px 0" }}>
                <label htmlFor="address-select">Entregar em:</label>
                <select
                  id="address-select"
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  style={{ display: "block", width: "100%", margin: "8px 0", padding: "8px" }}
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label ? `${a.label} — ` : ""}
                      {a.street}, {a.number} — {a.city}/{a.state}
                    </option>
                  ))}
                </select>
                <button type="button" className="normal" onClick={() => setShowAddressForm(true)}>
                  Novo endereço
                </button>
              </div>
            )}

            {user && showAddressForm && (
              <form
                onSubmit={handleSaveAddress}
                style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "15px 0" }}
              >
                <input name="label" placeholder="Rótulo (ex: Casa)" value={addressForm.label} onChange={handleAddressChange} />
                <input name="street" placeholder="Rua" value={addressForm.street} onChange={handleAddressChange} required />
                <input name="number" placeholder="Número" value={addressForm.number} onChange={handleAddressChange} required />
                <input
                  name="complement"
                  placeholder="Complemento"
                  value={addressForm.complement}
                  onChange={handleAddressChange}
                />
                <input name="district" placeholder="Bairro" value={addressForm.district} onChange={handleAddressChange} required />
                <input name="city" placeholder="Cidade" value={addressForm.city} onChange={handleAddressChange} required />
                <input
                  name="state"
                  placeholder="UF"
                  maxLength={2}
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  required
                />
                <input name="zipCode" placeholder="CEP" value={addressForm.zipCode} onChange={handleAddressChange} required />
                <button className="normal" type="submit">
                  Salvar endereço
                </button>
              </form>
            )}

            {checkoutError && <p className="coupon-msg">{checkoutError}</p>}

            <button className="normal" onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut ? "Processando..." : user ? "Fazer o Check-out" : "Entrar para finalizar a compra"}
            </button>
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
