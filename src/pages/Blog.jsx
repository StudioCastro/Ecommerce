import { useState } from "react";
import Newsletter from "../components/Newsletter.jsx";
import { blogPosts } from "../data/blogPosts.js";

const PER_PAGE = 3;

export default function Blog() {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(blogPosts.length / PER_PAGE));
  const pageItems = blogPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <section id="page-header" className="blog-header">
        <h2>#Consulte Mais Informação</h2>
        <p>Leia todos os estudos de caso sobre nosso produto!</p>
      </section>

      <section id="blog">
        {pageItems.map((post) => (
          <a href="#" className="blog-box" key={post.id}>
            <div className="blog-img">
              <img src={post.img} alt={post.title} />
            </div>
            <div className="blog-details">
              <h4>{post.title}</h4>
              <p>{post.excerpt}</p>
              <span className="read-more">CONTINUAR LENDO</span>
            </div>
            <h1>{post.date}</h1>
          </a>
        ))}
      </section>

      {totalPages > 1 && (
        <section id="pagination" className="section-p1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ opacity: page === i + 1 ? 1 : 0.6 }}>
              {i + 1}
            </button>
          ))}
        </section>
      )}

      <Newsletter />
    </>
  );
}
