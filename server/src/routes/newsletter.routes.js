import { Router } from "express";
import { z } from "zod";
import { newsletterController } from "../controllers/newsletter.controller.js";
import { validate } from "../middlewares/validate.js";

export const newsletterRouter = Router();

const newsletterSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido."),
  }),
});

newsletterRouter.post("/", validate(newsletterSchema), newsletterController.subscribe);
