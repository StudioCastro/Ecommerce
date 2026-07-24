import { prisma } from "../config/prisma.js";

const orderInclude = {
  items: { include: { variant: { include: { product: true } } } },
  payment: true,
};

export const orderRepository = {
  findProductsWithDefaultVariant(productIds) {
    return prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { variants: { take: 1 } },
    });
  },

  createOrder(data) {
    return prisma.order.create({ data, include: orderInclude });
  },

  findManyByUser(userId) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: orderInclude,
    });
  },

  findById(id) {
    return prisma.order.findUnique({ where: { id }, include: orderInclude });
  },

  findAll() {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { ...orderInclude, user: { select: { id: true, name: true, email: true } } },
    });
  },

  updateStatus(id, status) {
    return prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
  },

  update(id, data) {
    return prisma.order.update({ where: { id }, data, include: orderInclude });
  },

  updatePaymentByOrderId(orderId, data) {
    return prisma.payment.update({ where: { orderId }, data });
  },
};
