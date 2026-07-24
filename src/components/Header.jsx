import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingBag, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <section id="header">
      <NavLink to="/">
        <img src="/img/logo.png" className="logo" alt="Logo da loja" />
      </NavLink>

      <div>
        <ul id="navbar" className={menuOpen ? "active" : ""}>
          <li>
            <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" className={linkClass} onClick={() => setMenuOpen(false)}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={linkClass} onClick={() => setMenuOpen(false)}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
          </li>
          {user ? (
            <>
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <li>
                  <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>
                    Admin
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/account/orders" className={linkClass} onClick={() => setMenuOpen(false)} title={`Meus pedidos (${user.name})`}>
                  <FaUser />
                </NavLink>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} title="Sair">
                  <FaSignOutAlt />
                </a>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)} title="Entrar">
                <FaUser />
              </NavLink>
            </li>
          )}
          <li id="lg-bag">
            <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>
              <FaShoppingBag id="bolsa" />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </NavLink>
          </li>
          <a href="#" id="close" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }}>
            <FaTimes />
          </a>
        </ul>
      </div>

      <div id="mobile">
        <NavLink to="/cart" style={{ position: "relative" }}>
          <FaShoppingBag className="bolsa" />
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </NavLink>
        <FaBars id="bar" onClick={() => setMenuOpen(true)} />
      </div>
    </section>
  );
}
