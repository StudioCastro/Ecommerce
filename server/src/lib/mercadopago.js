import crypto from "node:crypto";
import { MercadoPagoConfig, Preference, Payment as MPPayment } from "mercadopago";
import { env } from "../config/env.js";

function getClient() {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("Mercado Pago não configurado (MERCADOPAGO_ACCESS_TOKEN ausente).");
  }
  return new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
}

// Cria a preference do Checkout Pro (hospedado) e retorna a URL de pagamento.
// `order` precisa vir com items.variant.product carregado (ver order.repository.js).
export async function createPreference(order) {
  const client = getClient();
  const preference = new Preference(client);

  const body = {
    items: order.items.map((item) => ({
      id: item.variant.product.id,
      title: item.variant.product.name,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: "BRL",
    })),
    external_reference: order.id,
    back_urls: {
      success: `${env.CLIENT_URL}/order/${order.id}/success`,
      failure: `${env.CLIENT_URL}/order/${order.id}/failure`,
      pending: `${env.CLIENT_URL}/order/${order.id}/pending`,
    },
  };

  // auto_return exige back_url.success pública (https) — a API do Mercado Pago rejeita
  // localhost. Em dev local o usuário só não é redirecionado automaticamente ao aprovar;
  // o botão "voltar ao site" na página do MP continua funcionando normalmente.
  if (env.CLIENT_URL.startsWith("https://")) {
    body.auto_return = "approved";
  }

  if (env.PUBLIC_SERVER_URL) {
    body.notification_url = `${env.PUBLIC_SERVER_URL}/api/v1/payments/webhook`;
  }

  const result = await preference.create({ body });
  return result.init_point;
}

// Valida o header x-signature enviado pelo Mercado Pago em toda notificação de webhook.
// Sem isso, o endpoint /payments/webhook aceitaria requisições de qualquer origem — um
// atacante poderia chamá-lo diretamente e forçar o servidor a buscar (e reagir a) qualquer
// paymentId da conta, sem nunca ter passado pelo Mercado Pago de verdade.
// Doc: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/webhooks#Validação-da-origem-da-notificação
export function verifyWebhookSignature({ xSignature, xRequestId, dataId }) {
  if (!env.MERCADOPAGO_WEBHOOK_SECRET) {
    // Sem segredo configurado (ex.: dev local) não há como validar — o schema de env.js já
    // impede subir em produção com MP habilitado e sem esse segredo.
    return env.NODE_ENV !== "production";
  }

  if (!xSignature || !xRequestId || !dataId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => part.trim().split("=").map((s) => s.trim()))
  );
  const { ts, v1: receivedHash } = parts;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
  const expectedHash = crypto
    .createHmac("sha256", env.MERCADOPAGO_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  const expected = Buffer.from(expectedHash, "hex");
  const received = Buffer.from(receivedHash, "hex");
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export async function fetchPayment(paymentId) {
  const client = getClient();
  const payment = new MPPayment(client);
  return payment.get({ id: paymentId });
}

export function mapPaymentStatus(mpStatus) {
  switch (mpStatus) {
    case "approved":
      return "APPROVED";
    case "refunded":
    case "charged_back":
      return "REFUNDED";
    case "rejected":
    case "cancelled":
      return "REJECTED";
    default:
      return "PENDING";
  }
}

export function mapPaymentMethod(paymentTypeId) {
  if (paymentTypeId === "pix") return "PIX";
  if (paymentTypeId === "ticket" || paymentTypeId === "atm") return "BOLETO";
  return "CARD";
}
