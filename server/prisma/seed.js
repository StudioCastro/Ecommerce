import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { seedProducts } from "./seedData.js";
import { slugify } from "../src/utils/slugify.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Populando o banco com dados iniciais...");

  const adminPasswordHash = await bcrypt.hash("Admin@123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@novaloja.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@novaloja.com.br",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const categories = new Map();
  const brands = new Map();

  for (const item of seedProducts) {
    const categorySlug = slugify(item.category);
    if (!categories.has(categorySlug)) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: { name: item.category, slug: categorySlug },
      });
      categories.set(categorySlug, category);
    }

    const brandSlug = slugify(item.brand);
    if (!brands.has(brandSlug)) {
      const brand = await prisma.brand.upsert({
        where: { slug: brandSlug },
        update: {},
        create: { name: item.brand, slug: brandSlug },
      });
      brands.set(brandSlug, brand);
    }

    const product = await prisma.product.upsert({
      where: { sku: item.id.toUpperCase() },
      update: {},
      create: {
        sku: item.id.toUpperCase(),
        name: item.name,
        slug: slugify(item.name),
        description: item.description,
        price: item.price,
        categoryId: categories.get(categorySlug).id,
        brandId: brands.get(brandSlug).id,
        images: {
          create: item.gallery.map((url, order) => ({ url, order })),
        },
        // Variante única (sem tamanho/cor) só para o carrinho/pedido poderem
        // referenciar um variantId — o site não usa variação de produto ainda.
        variants: {
          create: [{ inventory: { create: { quantity: 50, reserved: 0 } } }],
        },
      },
    });

    // Uma review aprovada do admin fixa o rating exibido hoje no site (a média vem das reviews).
    const existingReview = await prisma.review.findFirst({
      where: { productId: product.id, userId: admin.id },
    });
    if (!existingReview) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: admin.id,
          rating: item.rating,
          status: "APPROVED",
        },
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: "DESCONTO10" },
    update: {},
    create: { code: "DESCONTO10", type: "PERCENT", value: 10, isActive: true },
  });

  console.log("Seed concluído:");
  console.log(`- Admin: admin@novaloja.com.br / Admin@123456`);
  console.log(`- ${seedProducts.length} produtos, ${categories.size} categorias, ${brands.size} marcas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
