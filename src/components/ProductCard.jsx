import { Link } from "react-router-dom";
import { FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }

  return (
    <Link to={`/product/${product.slug}`} className="pro">
      <img className="pro-img" src={product.img} alt={product.name} />
      <div className="des">
        <span>{product.brand}</span>
        <h5>{product.name}</h5>
        <div className="star">
          {Array.from({ length: 5 }).map((_, i) =>
            i < product.rating ? <FaStar key={i} /> : <FaRegStar key={i} className="empty" />
          )}
        </div>
        <h4>R${product.price.toFixed(2)}</h4>
      </div>
      <button className="add-cart-btn" onClick={handleAddToCart} aria-label="Adicionar ao carrinho">
        <FaShoppingCart size={16} />
      </button>
    </Link>
  );
}
