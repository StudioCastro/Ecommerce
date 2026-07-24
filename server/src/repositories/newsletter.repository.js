import { prisma } from "../config/prisma.js";

export const newsletterRepository = {
  upsert(email) {
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  },
};
