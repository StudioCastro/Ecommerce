import { Router } from "express";
import rateLimit from "express-rate-limit";
import { paymentController } from "../controllers/payment.controller.js";

export const paymentsRouter = Router();

// Endpoint público (sem authenticate — quem chama é o Mercado Pago, não um usuário logado;
// a autenticidade é garantida por verifyWebhookSignature). Um limiter generoso evita que o
// endpoint seja usado para flood/DoS ou varredura de paymentId por terceiros.
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

paymentsRouter.post("/webhook", webhookLimiter, paymentController.webhook);
