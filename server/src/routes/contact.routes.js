import { Router } from "express";
import { z } from "zod";
import { contactController } from "../controllers/contact.controller.js";
import { validate } from "../middlewares/validate.js";

export const contactRouter = Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome muito curto."),
    email: z.string().email("E-mail inválido."),
    subject: z.string().optional(),
    message: z.string().min(5, "Mensagem muito curta."),
  }),
});

contactRouter.post("/", validate(contactSchema), contactController.create);
