import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";
import AccountOrders from "./pages/Account/Orders.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import AdminProducts from "./pages/Admin/Products.jsx";
import AdminOrders from "./pages/Admin/Orders.jsx";

const ADMIN_ROLES = ["ADMIN", "MANAGER"];

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/orders" element={<AccountOrders />} />
        <Route path="/order/:id" element={<OrderStatus />} />
        <Route path="/order/:id/:result" element={<OrderStatus />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <section className="section-p1" style={{ textAlign: "center" }}>
      <h2>404</h2>
      <p>Página não encontrada.</p>
    </section>
  );
}
