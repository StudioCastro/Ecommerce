import { Router } from "express";
import { z } from "zod";
import { productController } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const productsRouter = Router();

const adminOnly = [authenticate, authorize("ADMIN", "MANAGER")];

const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1, "SKU obrigatório."),
    name: z.string().min(2, "Nome muito curto."),
    description: z.string().min(2, "Descrição muito curta."),
    price: z.number().positive("Preço precisa ser positivo."),
    category: z.string().min(2, "Categoria obrigatória."),
    brand: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    stock: z.number().int().min(0).optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    sku: z.string().min(1).optional(),
    name: z.string().min(2).optional(),
    description: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(2).optional(),
    brand: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos ativos, com filtro opcional por categoria e paginação
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Slug da categoria
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200: { description: Lista paginada de produtos }
 */
productsRouter.get("/", productController.list);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Busca um produto pelo slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Produto encontrado }
 *       404: { description: Produto não encontrado }
 */
productsRouter.get("/:slug", productController.getBySlug);

productsRouter.post("/", ...adminOnly, validate(createProductSchema), productController.create);
productsRouter.put("/:id", ...adminOnly, validate(updateProductSchema), productController.update);
productsRouter.delete("/:id", ...adminOnly, productController.remove);
