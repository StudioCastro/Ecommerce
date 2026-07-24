# NovaLoja — E-commerce Responsivo

Recriação em React + Vite + React Router do projeto original `Ecommecer-Responsivo`
(HTML/CSS/JS puro), que evoluiu de uma landing page estática para uma aplicação
full-stack: front-end React consumindo uma API própria em Node/Express + Prisma
(PostgreSQL) + Redis, com autenticação, carrinho, pedidos, pagamento via Mercado
Pago e um painel administrativo.

## Estado atual (2026-07-24)

- **Front-end** (`src/`): React 18 + Vite + react-router-dom. Login/registro,
  carrinho, checkout, histórico de pedidos, área de conta e painel admin
  (produtos/pedidos). Deploy estático no GitHub Pages já configurado e
  funcionando: https://studiocastro.github.io/Ecommerce/
- **Backend** (`server/`): Express + Prisma + Postgres + Redis + Mercado Pago,
  rodando localmente via Docker Compose (`docker compose up -d`). Ainda **não
  está hospedado publicamente** — só existe na máquina de desenvolvimento.
- **Segurança**: já passou por uma rodada completa de hardening (JWT com
  segredos fortes e rotação de refresh token, rate limit em login/registro,
  verificação de assinatura do webhook do Mercado Pago, Docker rodando como
  usuário não-root, headers de segurança, cookies `httpOnly`/`Strict`,
  dependências com CVEs corrigidas). Ver histórico do git (commit
  "Adiciona backend completo, autenticação e endurece a segurança da
  aplicação") para o detalhe de cada item.

### Pendência em aberto: onde hospedar o backend

O site no GitHub Pages hoje só mostra a interface — login, produtos, carrinho
e pedidos não funcionam para quem não é você, porque o front aponta pro
backend em `localhost:3333`, que só existe na sua máquina. Para o site ficar
funcional para qualquer visitante, falta hospedar `server/` (+ Postgres +
Redis) em algum lugar público e apontar `VITE_API_URL` (no build do GitHub
Actions, via Settings > Secrets and variables > Actions > Variables) para essa
URL.

Opções discutidas:

- **Railway / Render** (recomendado para começar): conectam direto no repo,
  sobem o backend + Postgres + Redis a partir do `Dockerfile`/
  `docker-compose.yml` que já existe, com HTTPS automático — sem precisar
  mexer em servidor. Teto de uso gratuito menor, mas é rodando em minutos.
- **Hostinger VPS** (ou qualquer outro VPS): mais controle e pode sair mais
  barato a longo prazo, mas exige instalar Docker, configurar Nginx/SSL e
  manter o servidor manualmente. **Hospedagem compartilhada comum da
  Hostinger não serve** — precisa ser plano com VPS, já que a aplicação
  precisa rodar processos Node/Postgres/Redis persistentes, não só servir
  arquivos estáticos.

Decisão em 2026-07-24: adiar o deploy do backend por enquanto ("hoje está bom
por enquanto"). Próxima sessão: retomar por aqui — decidir Railway/Render vs
VPS e configurar o deploy.

## Como rodar

**Front-end (interface, sem dados reais funcionando sozinho):**

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

**Stack completa (front + backend + banco), pra tudo funcionar de verdade:**

```bash
docker compose up -d          # sobe Postgres, Redis e o backend (porta 3333)
npm install && npm run dev    # front-end (porta 5173), noutro terminal
```

O backend precisa de um `server/.env` preenchido (copie de `server/.env.example`
e ajuste os segredos — nunca reutilize os valores de exemplo, veja o aviso de
segurança no histórico do git).

## Estrutura

```
ecommerce-responsivo/
├── .github/workflows/deploy-pages.yml  # build + deploy do front no GitHub Pages
├── docker-compose.yml                  # Postgres + Redis + backend, pra rodar tudo local
├── public/img/          # imagens do projeto original (limpas, sem os arquivos quebrados)
├── src/                  # front-end (React + Vite + react-router-dom)
│   ├── main.jsx          # entry point + Router + AuthProvider + CartProvider
│   ├── App.jsx            # define as rotas (inclui /login, /admin, ProtectedRoute)
│   ├── context/           # AuthContext (sessão) e CartContext (carrinho, localStorage)
│   ├── services/api.js    # cliente HTTP da API (access token em memória, refresh via cookie)
│   ├── components/        # Header, Footer, Newsletter, ProductCard, ProtectedRoute
│   └── pages/             # Home, Shop, ProductDetail, Cart, Login, Register, Account/, Admin/...
└── server/                # backend (Node/Express + Prisma + Postgres + Redis + Mercado Pago)
    ├── prisma/schema.prisma   # modelo de dados (usuários, produtos, pedidos, pagamentos...)
    └── src/
        ├── app.js             # helmet, CORS, rate limit, Permissions-Policy
        ├── routes/ controllers/ services/ repositories/  # camadas da API REST (/api/v1/...)
        └── middlewares/       # auth (JWT), validate (Zod), errorHandler
```

## O que foi corrigido em relação ao site original

Durante a análise do zip enviado, encontrei os seguintes problemas — todos corrigidos nesta versão:

1. **Carrinho decorativo → carrinho funcional.** No original, o ícone de carrinho e o botão
   "adicionar" em cada produto eram `href="#"` sem nenhuma ação. Agora existe um
   `CartContext` de verdade: adicionar, remover, alterar quantidade, cupom de desconto
   (`DESCONTO10`) e total calculado dinamicamente. O carrinho persiste no `localStorage`,
   então sobrevive a um refresh da página.

2. **Produto repetido 16 vezes.** Todos os cards do site original tinham o mesmo nome
   ("Cartonn Astronaut T-Shirts"), a mesma marca ("adidas") e o mesmo preço ("$78").
   Agora existem 16 produtos diferentes, com nomes, categorias, preços e avaliações
   variados — inclusive com filtro por categoria na página Shop.

3. **Arquivos "lixo" nas imagens.** As pastas `img/banner` e `img/blog` do zip continham,
   além das imagens, um `.html` salvo do GitHub e uma pasta de assets dessa página salva
   por engano (`Build-and-Deploy-Ecommerce-Website...html`). Eles não foram copiados para
   este projeto.

4. **Tag `<marquee>` na página Sobre.** É uma tag obsoleta (não suportada nos navegadores
   modernos) usada para repetir o mesmo texto que já aparecia acima. Foi removida.

5. **Produto único fixo → rota dinâmica.** A página `sproduct.html` original sempre
   mostrava o mesmo produto (`f1.jpg`), não importava em qual card você clicasse.
   Agora `/product/:id` é dinâmica: cada card leva ao seu próprio produto, com galeria
   de miniaturas clicáveis reais.

6. **HTML com erros de sintaxe.** Havia `<div>`s não fechadas (ex: seção de produtos do
   `shop.html` terminava sem fechar `.pro-container`/`.pro`), tag `<Section>` com S
   maiúsculo, e `<i>` fechando tags erradas (`<a href="#"><img ...></i></a>`). Como tudo
   foi reescrito em componentes React, esses problemas não existem mais.

7. **CSS com valores inválidos.** Havia declarações quebradas como `font-size: 30 px`
   (espaço no meio do valor) e `white-space: nowarp` (erro de digitação de `nowrap`).
   Corrigidos no `index.css`.

8. **Formulários sem nenhuma validação.** O formulário de contato e o de newsletter
   apenas existiam visualmente — não tinham `name`/`type` corretos nem qualquer verificação.
   Agora ambos validam campos obrigatórios e mostram mensagem de confirmação.

9. **Textos placeholder / lorem ipsum e endereço fictício nos EUA misturado com telefone
   indiano.** Troquei pelos textos e endereço em português, consistentes.

10. **Sem paginação real.** Os links "1", "2", "→" nas páginas Shop e Blog eram estáticos
    (`href="#"`). Agora a paginação funciona de verdade com `useState`.

## Pontos que seguem como estão (avisos, não bugs)

- O vídeo `about/1.mp4` tem ~8MB — considere comprimir ou trocar por um vídeo hospedado
  externamente (YouTube/Vimeo embed) antes de colocar em produção, para não pesar o
  carregamento da página Sobre.
- O mapa do Google Maps embutido na página Contact usa coordenadas genéricas de exemplo —
  troque pelo endereço real da loja.
- O e-mail, telefone e endereço no rodapé/contato são fictícios — troque pelos reais.
