import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { swaggerSpec } from "./docs/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

export const app = express();

// Necessário atrás de um reverse proxy/load balancer (Nginx, Render, Fly.io etc.) para que
// req.ip reflita o IP real do cliente (rate limiting) e req.secure funcione corretamente
// (cookie `secure` e detecção de HTTPS), em vez de sempre ver o IP interno do proxy.
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Segurança básica de headers HTTP
app.use(helmet());

// Helmet não define Permissions-Policy por padrão — desabilita explicitamente APIs de
// navegador sensíveis (câmera, geolocalização, etc.) que esta aplicação não usa.
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );
  next();
});

// CORS restrito à origem do front-end configurada em .env
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // necessário para o cookie httpOnly do refresh token
  })
);

// Rate limiting geral — protege contra força bruta e abuso de API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Muitas requisições. Tente novamente em alguns minutos." } },
});
app.use(globalLimiter);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Documentação interativa da API em /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);
