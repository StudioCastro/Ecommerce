import { prisma } from "../config/prisma.js";
import { slugify } from "../utils/slugify.js";

export const brandRepository = {
  upsertByName(name) {
    const slug = slugify(name);
    return prisma.brand.upsert({ where: { slug }, update: {}, create: { name, slug } });
  },
};
