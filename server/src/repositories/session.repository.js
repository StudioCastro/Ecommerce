import { prisma } from "../config/prisma.js";

export const sessionRepository = {
  create({ userId, refreshToken, userAgent, ip, expiresAt }) {
    return prisma.session.create({ data: { userId, refreshToken, userAgent, ip, expiresAt } });
  },
  findByToken(refreshToken) {
    return prisma.session.findUnique({ where: { refreshToken } });
  },
  deleteByToken(refreshToken) {
    return prisma.session.deleteMany({ where: { refreshToken } });
  },
};
