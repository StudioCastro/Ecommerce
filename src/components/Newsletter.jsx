import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setMessage("Digite um e-mail válido.");
      return;
    }
    setMessage("Inscrição confirmada! Fique de olho na sua caixa de entrada.");
    setEmail("");
  }

  return (
    <section id="newslatter" className="section-p1 section-m1">
      <div className="newstext">
        <h4>Inscreva-se na Newsletter!</h4>
        <p>
          Receba atualizações por e-mail sobre <span>ofertas especiais.</span>
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Seu endereço de E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="normal" type="submit">
            Inscreva-se
          </button>
        </form>
        {message && <p className="newsletter-msg">{message}</p>}
      </div>
    </section>
  );
}
