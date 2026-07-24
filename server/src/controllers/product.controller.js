import { productService } from "../services/product.service.js";
import { AppError } from "../middlewares/errorHandler.js";

export const productController = {
  async list(req, res, next) {
    try {
      const { category, page, pageSize } = req.query;
      const result = await productService.list({ category, page, pageSize });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      if (!product) {
        throw new AppError("Produto não encontrado.", 404);
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await productService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
