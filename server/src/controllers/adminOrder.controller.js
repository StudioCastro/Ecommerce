import { orderService } from "../services/order.service.js";

export const adminOrderController = {
  async list(req, res, next) {
    try {
      const orders = await orderService.adminList();
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const order = await orderService.adminUpdateStatus(req.params.id, req.body);
      res.json(order);
    } catch (err) {
      next(err);
    }
  },
};
