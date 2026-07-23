# NovaLoja — E-commerce Responsivo (React)

Recriação em React + Vite + React Router do projeto original `Ecommecer-Responsivo`
(HTML/CSS/JS puro). Todas as páginas foram portadas e o carrinho agora é
**funcional de verdade** (o original só tinha links `href="#"` decorativos).

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Estrutura

```
ecommerce-responsivo/
├── public/img/          # imagens do projeto original (limpas, sem os arquivos quebrados)
└── src/
    ├── main.jsx          # entry point + Router + CartProvider
    ├── App.jsx            # define as rotas
    ├── index.css          # CSS global (adaptado do style.css original)
    ├── context/
    │   └── CartContext.jsx   # estado global do carrinho, persistido no localStorage
    ├── data/
    │   ├── products.js       # catálogo (16 produtos, cada um com nome/preço/categoria reais)
    │   └── blogPosts.js      # posts do blog
    ├── components/
    │   ├── Header.jsx        # navegação + menu mobile + contador do carrinho
    │   ├── Footer.jsx
    │   ├── Newsletter.jsx    # formulário com validação
    │   └── ProductCard.jsx   # card de produto reutilizável
    └── pages/
        ├── Home.jsx
        ├── Shop.jsx           # com filtro por categoria e paginação real
        ├── ProductDetail.jsx  # rota dinâmica /product/:id, galeria de imagens
        ├── Cart.jsx           # carrinho de verdade: remover, alterar qtd, cupom
        ├── About.jsx
        ├── Contact.jsx        # formulário com validação e mensagem de sucesso
        └── Blog.jsx           # com paginação
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
