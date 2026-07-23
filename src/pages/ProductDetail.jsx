import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import Newsletter from "../components/Newsletter.jsx";
import { getProductById, products } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";

const sizes = ["P", "M", "G", "GG"];

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useCart();

  const [mainImg, setMainImg] = useState(product?.img);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="section-p1" style={{ textAlign: "center" }}>
        <h2>Produto não encontrado</h2>
        <p>O produto que você procura não existe ou foi removido.</p>
        <Link to="/shop">
          <button className="normal">Voltar para a loja</button>
        </Link>
      </section>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  function handleAddToCart() {
    if (!size) {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <>
      <section id="prodetails" className="section-p1">
        <div className="single-pro-image">
          <img src={mainImg} width="100%" id="MainImg" alt={product.name} />
          <div className="small-img-group">
            {product.gallery.map((src) => (
              <div
                className={`small-img-col ${mainImg === src ? "active" : ""}`}
                key={src}
                onClick={() => setMainImg(src)}
              >
                <img src={src} width="100%" className="small-img" alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="single-pro-datails">
          <h6>
            Home / {product.category}
          </h6>
          <h4>{product.name}</h4>
          <h2>R${product.price.toFixed(2)}</h2>

          <span className="stock-status">Em estoque</span>

          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Selecione o Tamanho</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          />

          <button className="normal" onClick={handleAddToCart}>
            {added ? "Adicionado! ✓" : "Adicionar ao Carrinho"}
          </button>

          <h4>Detalhes do Produto</h4>
          <span>
            <p>{product.description}</p>
          </span>
        </div>
      </section>

      {related.length > 0 && (
        <section id="product1" className="section-p1">
          <h2>Você também pode gostar</h2>
          <p>Outros produtos da categoria {product.category}</p>
          <div className="pro-container">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
