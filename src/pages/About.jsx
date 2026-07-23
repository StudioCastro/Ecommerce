import Newsletter from "../components/Newsletter.jsx";

const features = [
  { img: "/img/features/f1.png", label: "Frete Grátis" },
  { img: "/img/features/f2.png", label: "Pedido Online" },
  { img: "/img/features/f3.png", label: "Economizar" },
  { img: "/img/features/f4.png", label: "Promoções" },
  { img: "/img/features/f5.png", label: "Feliz Venda" },
  { img: "/img/features/f6.png", label: "Suporte 24 Horas" },
];

export default function About() {
  return (
    <>
      <section id="page-header" className="about-header">
        <h2>#Sobre Nós</h2>
        <p>Conheça um pouco mais da nossa história</p>
      </section>

      <section id="about-head" className="section-p1">
        <img src="/img/about/a6.jpg" alt="Nossa equipe" />
        <div>
          <h2>Quem somos nós?</h2>
          <p>
            Somos uma loja voltada para quem busca peças com identidade e qualidade no dia a dia.
            Trabalhamos com marcas parceiras selecionadas e um processo de curadoria cuidadoso para
            trazer o melhor custo-benefício em cada coleção.
          </p>
          <p id="about-quote">
            "Criamos looks com tanto ou pouco controle quanto você quiser, graças a uma seleção de
            estilos básicos e criativos."
          </p>
        </div>
      </section>

      <section id="about-app" className="section-p1">
        <h1>
          Baixe nosso <a href="#">App</a>
        </h1>
        <div className="video">
          <video autoPlay muted loop src="/img/about/1.mp4" />
        </div>
      </section>

      <section id="feature" className="section-p1">
        {features.map((f) => (
          <div className="fe-box" key={f.label}>
            <img src={f.img} alt="" />
            <h6>{f.label}</h6>
          </div>
        ))}
      </section>

      <Newsletter />
    </>
  );
}
