import { prisma } from "../config/prisma.js";

export const couponRepository = {
  findByCode(code) {
    return prisma.coupon.findUnique({ where: { code } });
  },
  incrementUsage(id) {
    return prisma.coupon.update({ where: { id }, data: { usedCount: { increment: 1 } } });
  },
};
