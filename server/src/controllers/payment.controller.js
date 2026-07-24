import { fetchPayment, mapPaymentStatus, mapPaymentMethod, verifyWebhookSignature } from "../lib/mercadopago.js";
import { orderRepository } from "../repositories/order.repository.js";

export const paymentController = {
  async webhook(req, res) {
    try {
      const paymentId = req.query["data.id"] || req.body?.data?.id || req.query.id;
      const type = req.query.type || req.body?.type || req.query.topic;

      const signatureValid = verifyWebhookSignature({
        xSignature: req.headers["x-signature"],
        xRequestId: req.headers["x-request-id"],
        dataId: paymentId,
      });
      if (!signatureValid) {
        console.warn("Webhook do Mercado Pago rejeitado: assinatura inválida ou ausente.");
        return res.status(401).end();
      }

      // O Mercado Pago manda outros tipos de notificação também — só nos interessa "payment".
      if (type !== "payment" || !paymentId) {
        return res.status(200).end();
      }

      const payment = await fetchPayment(paymentId);
      const orderId = payment.external_reference;
      if (!orderId) return res.status(200).end();

      await orderRepository.updatePaymentByOrderId(orderId, {
        status: mapPaymentStatus(payment.status),
        method: mapPaymentMethod(payment.payment_type_id),
        externalId: String(payment.id),
        rawPayload: payment,
      });

      if (payment.status === "approved") {
        await orderRepository.updateStatus(orderId, "PAID");
      }

      res.status(200).end();
    } catch (err) {
      // Responde 200 mesmo em erro — senão o Mercado Pago fica reenviando indefinidamente
      // uma notificação que nunca vai suceder (ex.: pedido já não existe mais).
      console.error("Erro ao processar webhook do Mercado Pago:", err.message);
      res.status(200).end();
    }
  },
};
