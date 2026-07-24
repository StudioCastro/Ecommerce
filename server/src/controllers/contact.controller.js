import { contactService } from "../services/contact.service.js";

export const contactController = {
  async create(req, res, next) {
    try {
      await contactService.create(req.body);
      res.status(201).json({ message: "Mensagem enviada com sucesso!" });
    } catch (err) {
      next(err);
    }
  },
};
