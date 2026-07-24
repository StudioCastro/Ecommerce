import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { AppError } from "../middlewares/errorHandler.js";

export const authRouter = Router();

// Respostas de auth carregam accessToken/dados do usuário — nunca devem ficar em cache
// de proxies intermediários nem no histórico do navegador (back/forward cache).
authRouter.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Rate limit dedicado e restritivo: o limiter global (300 req/15min) é permissivo
// demais para login/registro, permitindo brute-force/credential stuffing contra
// contas de clientes. Aqui, poucas tentativas por IP já indicam abuso.
const bruteForceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res, next) => {
    next(new AppError("Muitas tentativas. Tente novamente em alguns minutos.", 429));
  },
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome muito curto."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido."),
    password: z.string().min(1, "Senha obrigatória."),
  }),
});

authRouter.post("/register", bruteForceLimiter, validate(registerSchema), authController.register);
authRouter.post("/login", bruteForceLimiter, validate(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticate, authController.me);
