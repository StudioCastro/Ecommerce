import { Router } from "express";
import { z } from "zod";
import { addressController } from "../controllers/address.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";

export const addressesRouter = Router();

addressesRouter.use(authenticate);

const createAddressSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    street: z.string().min(2, "Rua inválida."),
    number: z.string().min(1, "Número obrigatório."),
    complement: z.string().optional(),
    district: z.string().min(2, "Bairro inválido."),
    city: z.string().min(2, "Cidade inválida."),
    state: z.string().length(2, "UF deve ter 2 letras."),
    zipCode: z.string().min(8, "CEP inválido."),
    isDefault: z.boolean().optional(),
  }),
});

addressesRouter.get("/", addressController.list);
addressesRouter.post("/", validate(createAddressSchema), addressController.create);
