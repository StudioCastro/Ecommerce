import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NovaLoja API",
      version: "1.0.0",
      description: "API REST do e-commerce NovaLoja — autenticação, catálogo, carrinho, pedidos e painel administrativo.",
    },
    servers: [{ url: "/api/v1" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  // Lê comentários JSDoc (@swagger) nos arquivos de rota para gerar a documentação
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
