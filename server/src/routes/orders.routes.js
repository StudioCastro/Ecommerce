import { Router } from "express";
import { z } from "zod";
import { orderController } from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";

export const ordersRouter = Router();

ordersRouter.use(authenticate);

const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().uuid("productId inválido."),
          qty: z.number().int().positive(),
        })
      )
      .min(1, "O carrinho está vazio."),
    addressId: z.string().uuid("addressId inválido."),
    couponCode: z.string().optional(),
  }),
});

ordersRouter.post("/", validate(createOrderSchema), orderController.create);
ordersRouter.get("/", orderController.list);
ordersRouter.get("/:id", orderController.getById);
