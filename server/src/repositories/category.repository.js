import { prisma } from "../config/prisma.js";
import { slugify } from "../utils/slugify.js";

export const categoryRepository = {
  upsertByName(name) {
    const slug = slugify(name);
    return prisma.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
  },
};
