import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" src="/img/logo.png" alt="Logo da loja" />
        <h4>Contato</h4>
        <p>
          <strong>Endereço:</strong> Rua das Flores, 562 - São Paulo, SP
        </p>
        <p>
          <strong>Telefone:</strong> (11) 2222-3654
        </p>
        <p>
          <strong>Horário:</strong> 10:00-18:00, Seg - Sáb
        </p>
        <div className="follow">
          <h4>Siga-nos</h4>
          <div className="icon">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>Sobre</h4>
        <a href="#">Sobre Nós</a>
        <a href="#">Informações de Envio</a>
        <a href="#">Política de Privacidade</a>
        <a href="#">Termos e Condições</a>
        <a href="#">Entre em Contato</a>
      </div>

      <div className="col">
        <h4>Minha Conta</h4>
        <a href="#">Entrar</a>
        <a href="#">Ver Carrinho</a>
        <a href="#">Minha Lista de Desejos</a>
        <a href="#">Rastrear Meu Pedido</a>
        <a href="#">Ajuda</a>
      </div>

      <div className="col install">
        <h4>Instalar o App</h4>
        <p>Para App Store ou Google Play</p>
        <div className="row">
          <img src="/img/pay/app.jpg" alt="Disponível na App Store" />
          <img src="/img/pay/play.jpg" alt="Disponível no Google Play" />
        </div>
        <p>Meios de Pagamento</p>
        <img src="/img/pay/pay.png" alt="Meios de pagamento aceitos" />
      </div>

      <div className="copyright">
        <p>© 2026, NovaLoja — projeto de estudo em React</p>
      </div>
    </footer>
  );
}
