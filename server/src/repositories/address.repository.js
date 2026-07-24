import { prisma } from "../config/prisma.js";

export const addressRepository = {
  findManyByUser(userId) {
    return prisma.address.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },
  findById(id) {
    return prisma.address.findUnique({ where: { id } });
  },
  create(userId, data) {
    return prisma.address.create({ data: { ...data, userId } });
  },
};
