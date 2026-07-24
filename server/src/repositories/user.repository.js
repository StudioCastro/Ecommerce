import { prisma } from "../config/prisma.js";

export const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
  create({ name, email, passwordHash }) {
    return prisma.user.create({ data: { name, email, passwordHash } });
  },
};
