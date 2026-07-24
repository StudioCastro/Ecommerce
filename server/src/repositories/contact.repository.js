import { prisma } from "../config/prisma.js";

export const contactRepository = {
  create(data) {
    return prisma.contactMessage.create({ data });
  },
};
