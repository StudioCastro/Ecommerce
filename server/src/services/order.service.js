import { orderRepository } from "../repositories/order.repository.js";
import { couponRepository } from "../repositories/coupon.repository.js";
import { addressService } from "./address.service.js";
import { AppError } from "../middlewares/errorHandler.js";
import { createPreference } from "../lib/mercadopago.js";

function toDTO(order) {
  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    trackingCode: order.trackingCode,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      productId: item.variant.product.id,
      productName: item.variant.product.name,
      productSlug: item.variant.product.slug,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
    payment: order.payment ? { status: order.payment.status, method: order.payment.method } : null,
  };
}

export const orderService = {
  async create(userId, { items, addressId, couponCode }) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("O carrinho está vazio.", 422);
    }

    const address = await addressService.getOwned(userId, addressId);

    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await orderRepository.findProductsWithDefaultVariant(productIds);
    const productById = new Map(products.map((p) => [p.id, p]));

    if (productById.size !== productIds.length) {
      throw new AppError("Um ou mais produtos do carrinho não estão mais disponíveis.", 422);
    }

    let subtotal = 0;
    const orderItemsData = items.map(({ productId, qty }) => {
      const product = productById.get(productId);
      if (!product?.variants[0]) {
        throw new AppError(`Produto indisponível: ${productId}`, 422);
      }
      const quantity = Math.max(1, Number(qty) || 1);
      const unitPrice = Number(product.price);
      subtotal += unitPrice * quantity;
      return { variantId: product.variants[0].id, quantity, unitPrice };
    });

    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await couponRepository.findByCode(couponCode.trim().toUpperCase());
      if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        throw new AppError("Cupom inválido ou expirado.", 422);
      }
      if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError("Este cupom atingiu o limite de uso.", 422);
      }
      discount = coupon.type === "PERCENT" ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value);
      discount = Math.min(discount, subtotal);
    }

    const total = subtotal - discount;

    const order = await orderRepository.createOrder({
      userId,
      addressId: address.id,
      couponId: coupon?.id,
      subtotal,
      discount,
      total,
      items: { create: orderItemsData },
      // method é um placeholder — o valor real (pix/cartão/boleto) é corrigido
      // pelo webhook do Mercado Pago quando o pagamento é confirmado (Fase 8).
      payment: { create: { provider: "MERCADOPAGO", method: "PIX", status: "PENDING" } },
    });

    if (coupon) {
      await couponRepository.incrementUsage(coupon.id);
    }

    let checkoutUrl = null;
    try {
      checkoutUrl = await createPreference(order);
    } catch (err) {
      console.error("Falha ao criar preference no Mercado Pago:", err.message);
    }

    return { order: toDTO(order), checkoutUrl };
  },

  async listByUser(userId) {
    const orders = await orderRepository.findManyByUser(userId);
    return orders.map(toDTO);
  },

  async getOwned(userId, orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      throw new AppError("Pedido não encontrado.", 404);
    }
    return toDTO(order);
  },

  async adminList() {
    const orders = await orderRepository.findAll();
    return orders.map((order) => ({
      ...toDTO(order),
      customer: { id: order.user.id, name: order.user.name, email: order.user.email },
    }));
  },

  async adminUpdateStatus(orderId, { status, trackingCode }) {
    const order = await orderRepository.update(orderId, {
      status,
      ...(trackingCode !== undefined ? { trackingCode } : {}),
    });
    return toDTO(order);
  },
};
