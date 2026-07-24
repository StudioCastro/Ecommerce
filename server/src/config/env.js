import "dotenv/config";
import { z } from "zod";

// Valida as variáveis de ambiente na inicialização — falha rápido se algo essencial faltar,
// em vez de deixar o erro estourar em algum ponto aleatório do código depois.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório"),
  REDIS_URL: z.string().min(1, "REDIS_URL é obrigatório"),
  // 32 chars (256 bits) é o mínimo recomendado para segredos HMAC (HS256) — abaixo disso,
  // o segredo fica vulnerável a força bruta offline caso um token vaze.
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET precisa ter pelo menos 32 caracteres"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET precisa ter pelo menos 32 caracteres"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  // URL pública do próprio backend — usada como notification_url do Mercado Pago.
  // Sem ela (dev local), a preference é criada normalmente, só sem webhook.
  PUBLIC_SERVER_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  // Secret key da notificação webhook (painel MP > Suas integrações > Webhooks) — usada
  // para validar o header x-signature e garantir que a notificação veio mesmo do Mercado Pago.
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),
  MELHOR_ENVIO_TOKEN: z.string().optional(),
}).refine(
  (data) => data.NODE_ENV !== "production" || !data.MERCADOPAGO_ACCESS_TOKEN || data.MERCADOPAGO_WEBHOOK_SECRET,
  {
    message:
      "MERCADOPAGO_WEBHOOK_SECRET é obrigatório em produção quando MERCADOPAGO_ACCESS_TOKEN está configurado (necessário para validar a assinatura do webhook).",
    path: ["MERCADOPAGO_WEBHOOK_SECRET"],
  }
);

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
