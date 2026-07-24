import { orderService } from "../services/order.service.js";

export const orderController = {
  async create(req, res, next) {
    try {
      const result = await orderService.create(req.user.sub, req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const orders = await orderService.listByUser(req.user.sub);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const order = await orderService.getOwned(req.user.sub, req.params.id);
      res.json(order);
    } catch (err) {
      next(err);
    }
  },
};
