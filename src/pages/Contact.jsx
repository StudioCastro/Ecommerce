import { useState } from "react";
import Newsletter from "../components/Newsletter.jsx";

const people = [
  {
    img: "/img/people/1.png",
    name: "José",
    text: "O atendimento foi rápido e a equipe resolveu minha dúvida sobre trocas em poucos minutos.",
  },
  {
    img: "/img/people/2.png",
    name: "João",
    text: "Comprei duas vezes e as duas entregas chegaram antes do prazo estimado. Recomendo!",
  },
  {
    img: "/img/people/3.png",
    name: "Maria",
    text: "Ótima variedade de produtos e o suporte por chat foi bem atencioso comigo.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <>
      <section id="page-header" className="about-header">
        <h2>#Vamos conversar</h2>
        <p>DEIXE UMA MENSAGEM, adoramos ouvir você!</p>
      </section>

      <section id="contact-details" className="section-p1">
        <div className="details">
          <span>ENTRE EM CONTATO</span>
          <h2>Visite uma de nossas lojas ou entre em contato conosco hoje</h2>
          <h3>Sede</h3>
          <ul>
            <li>
              <img className="icon" src="/img/map-pin.png" alt="" />
              <p>Rua das Flores, 562 - São Paulo, SP</p>
            </li>
            <li>
              <img className="icon" src="/img/envelope.png" alt="" />
              <p>contato@novaloja.com.br</p>
            </li>
            <li>
              <img className="icon" src="/img/phone-call.png" alt="" />
              <p>(11) 2222-3654</p>
            </li>
            <li>
              <img className="icon" src="/img/clock.png" alt="" />
              <p>Segunda a sexta: 9:00 às 18:00</p>
            </li>
          </ul>
        </div>

        <div className="map">
          <iframe
            title="Localização da loja"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58562.85!2d-46.65!3d-23.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1spt-BR!2sbr"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section id="form-details">
        <form onSubmit={handleSubmit}>
          <span>DEIXE UMA MENSAGEM</span>
          <h2>Adoramos ouvir você</h2>
          {sent && <p className="success-msg">Mensagem enviada com sucesso! Responderemos em breve.</p>}
          <input type="text" name="name" placeholder="Seu Nome" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
          <input type="text" name="subject" placeholder="Assunto" value={form.subject} onChange={handleChange} />
          <textarea
            name="message"
            cols="30"
            rows="10"
            placeholder="Sua Mensagem"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button className="normal" type="submit">
            Enviar
          </button>
        </form>

        <div className="people">
          {people.map((p) => (
            <div key={p.name}>
              <img src={p.img} alt={p.name} />
              <p>
                <span>{p.name}</span>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
