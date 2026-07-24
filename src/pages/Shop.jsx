import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import Newsletter from "../components/Newsletter.jsx";
import { useProducts } from "../hooks/useProducts.js";

const PER_PAGE = 8;

export default function Shop() {
  const { products, loading, error } = useProducts();
  const [category, setCategory] = useState("Todos");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ["Todos", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(
    () => (category === "Todos" ? products : products.filter((p) => p.category === category)),
    [category, products]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleCategoryChange(cat) {
    setCategory(cat);
    setPage(1);
  }

  return (
    <>
      <section id="page-header">
        <h2>#Fique em Casa</h2>
        <p>Economize mais com cupons e até 70% de desconto!</p>
      </section>

      <section className="section-p1" style={{ textAlign: "center", paddingBottom: 0 }}>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className="normal"
              style={{
                backgroundColor: cat === category ? "#088178" : "#fff",
                color: cat === category ? "#fff" : "#000",
                border: "1px solid #cce7d0",
              }}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section id="product1" className="section-p1">
        {loading && <p>Carregando produtos...</p>}
        {error && <p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>}
        <div className="pro-container">
          {pageItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {totalPages > 1 && (
        <section id="pagination" className="section-p1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{ opacity: page === i + 1 ? 1 : 0.6 }}
            >
              {i + 1}
            </button>
          ))}
        </section>
      )}

      <Newsletter />
    </>
  );
}
