import { prisma } from "../config/prisma.js";

const baseInclude = {
  images: { orderBy: { order: "asc" } },
  brand: true,
  category: true,
  reviews: { where: { status: "APPROVED" }, select: { rating: true } },
};

export const productRepository = {
  async findMany({ category, page, pageSize }) {
    const where = {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: baseInclude,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  },

  async findBySlug(slug) {
    return prisma.product.findUnique({
      where: { slug },
      include: baseInclude,
    });
  },

  findById(id) {
    return prisma.product.findUnique({ where: { id }, include: baseInclude });
  },

  create(data) {
    return prisma.product.create({ data, include: baseInclude });
  },

  update(id, data) {
    return prisma.product.update({ where: { id }, data, include: baseInclude });
  },

  // Soft delete: produtos já comprados não podem ser removidos de verdade (o
  // ProductVariant fica referenciado por OrderItem). isActive:false já é o filtro
  // usado por findMany/findBySlug, então o produto some da loja imediatamente.
  deactivate(id) {
    return prisma.product.update({ where: { id }, data: { isActive: false } });
  },
};
