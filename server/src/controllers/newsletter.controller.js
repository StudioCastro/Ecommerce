import { newsletterService } from "../services/newsletter.service.js";

export const newsletterController = {
  async subscribe(req, res, next) {
    try {
      await newsletterService.subscribe(req.body.email);
      res.status(201).json({ message: "Inscrição confirmada!" });
    } catch (err) {
      next(err);
    }
  },
};
