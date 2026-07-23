import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import Newsletter from "../components/Newsletter.jsx";
import { products } from "../data/products.js";

const features = [
  { img: "/img/features/f1.png", label: "Frete Grátis" },
  { img: "/img/features/f2.png", label: "Pedido Online" },
  { img: "/img/features/f3.png", label: "Economizar" },
  { img: "/img/features/f4.png", label: "Promoções" },
  { img: "/img/features/f5.png", label: "Feliz Venda" },
  { img: "/img/features/f6.png", label: "Suporte 24 Horas" },
];

export default function Home() {
  const featured = products.slice(0, 8);
  const newCollection = products.slice(8, 16);

  return (
    <>
      <section id="hero">
        <h4>Oferta-de-Troca</h4>
        <h2>Super Ofertas</h2>
        <h1>Em Todos os Produtos</h1>
        <p>Economize mais com cupons e até 70% de desconto!</p>
        <Link to="/shop">
          <button>Compre Agora</button>
        </Link>
      </section>

      <section id="feature" className="section-p1">
        {features.map((f) => (
          <div className="fe-box" key={f.label}>
            <img src={f.img} alt="" />
            <h6>{f.label}</h6>
          </div>
        ))}
      </section>

      <section id="product1" className="section-p1">
        <h2>Produtos em Destaque</h2>
        <p>Coleção de Verão Novo Design Moderno</p>
        <div className="pro-container">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="banner" className="section-m1">
        <h4>Serviço de Reparo</h4>
        <h2>
          Até <span>70% de Desconto</span> - em Todas as Camisas & Acessórios
        </h2>
        <Link to="/shop">
          <button className="normal">Explore Mais</button>
        </Link>
      </section>

      <section id="product1" className="section-p1">
        <h2>Nova Coleção</h2>
        <p>Coleção de Verão Novo Design Moderno</p>
        <div className="pro-container">
          {newCollection.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="sm-banner" className="section-p1">
        <div className="banner-box">
          <h4>Ofertas Malucas</h4>
          <h2>Compre 1 leve 1 de graça</h2>
          <span>Peças selecionadas da coleção estão com desconto especial esta semana.</span>
          <Link to="/shop">
            <button className="white">Comprar Agora</button>
          </Link>
        </div>
        <div className="banner-box banner-box2">
          <h4>Primavera/Verão</h4>
          <h2>Próxima Temporada</h2>
          <span>Confira o que chegou de novo para a próxima estação.</span>
          <Link to="/shop">
            <button className="white">Coleção</button>
          </Link>
        </div>
      </section>

      <section id="banner3">
        <div className="banner-box">
          <h2>Venda de Temporada</h2>
          <h3>Coleções de Inverno -50% de Desconto</h3>
        </div>
        <div className="banner-box banner-box2">
          <h2>Nova Coleção de Calçados</h2>
          <h3>Primavera / Verão 2026</h3>
        </div>
        <div className="banner-box banner-box3">
          <h2>Camisas</h2>
          <h3>Novas Tendências de Estampas</h3>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
