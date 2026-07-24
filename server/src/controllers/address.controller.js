import { addressService } from "../services/address.service.js";

export const addressController = {
  async list(req, res, next) {
    try {
      const addresses = await addressService.list(req.user.sub);
      res.json(addresses);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const address = await addressService.create(req.user.sub, req.body);
      res.status(201).json(address);
    } catch (err) {
      next(err);
    }
  },
};
