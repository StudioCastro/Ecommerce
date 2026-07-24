import { productRepository } from "../repositories/product.repository.js";
import { categoryRepository } from "../repositories/category.repository.js";
import { brandRepository } from "../repositories/brand.repository.js";
import { slugify } from "../utils/slugify.js";
import { AppError } from "../middlewares/errorHandler.js";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;

// Formato consumido pelo front-end: mesmo shape do antigo src/data/products.js,
// só que com slug (usado nas rotas) e rating calculado a partir das reviews aprovadas.
function toDTO(product) {
  const images = product.images.map((image) => image.url);
  const ratings = product.reviews.map((review) => review.rating);
  const rating = ratings.length
    ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10
    : 0;

  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    img: images[0] ?? null,
    gallery: images,
    brand: product.brand?.name ?? null,
    name: product.name,
    category: product.category.name,
    price: Number(product.price),
    rating,
    description: product.description,
    isActive: product.isActive,
  };
}

export const productService = {
  async list({ category, page = 1, pageSize } = {}) {
    const pageNumber = Number(page) || 1;
    const size = Math.min(Number(pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const { items, total } = await productRepository.findMany({
      category,
      page: pageNumber,
      pageSize: size,
    });

    return {
      items: items.map(toDTO),
      page: pageNumber,
      pageSize: size,
      total,
      totalPages: Math.ceil(total / size),
    };
  },

  async getBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    return product ? toDTO(product) : null;
  },

  async create(data) {
    const category = await categoryRepository.upsertByName(data.category);
    const brand = data.brand ? await brandRepository.upsertByName(data.brand) : null;

    const product = await productRepository.create({
      sku: data.sku,
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      price: data.price,
      categoryId: category.id,
      brandId: brand?.id,
      images: { create: (data.gallery ?? []).map((url, order) => ({ url, order })) },
      variants: { create: [{ inventory: { create: { quantity: data.stock ?? 0, reserved: 0 } } }] },
    });

    return toDTO(product);
  },

  async update(id, data) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new AppError("Produto não encontrado.", 404);

    const updateData = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }
    if (data.description) updateData.description = data.description;
    if (data.price != null) updateData.price = data.price;
    if (data.sku) updateData.sku = data.sku;
    if (data.isActive != null) updateData.isActive = data.isActive;
    if (data.category) {
      const category = await categoryRepository.upsertByName(data.category);
      updateData.categoryId = category.id;
    }
    if (data.brand) {
      const brand = await brandRepository.upsertByName(data.brand);
      updateData.brandId = brand.id;
    }

    const product = await productRepository.update(id, updateData);
    return toDTO(product);
  },

  async remove(id) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new AppError("Produto não encontrado.", 404);
    await productRepository.deactivate(id);
  },
};
