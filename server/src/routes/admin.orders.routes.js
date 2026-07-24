import { Router } from "express";
import { z } from "zod";
import { adminOrderController } from "../controllers/adminOrder.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const adminOrdersRouter = Router();

adminOrdersRouter.use(authenticate, authorize("ADMIN", "MANAGER"));

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["CREATED", "PAID", "SEPARATING", "SHIPPED", "DELIVERED", "CANCELED", "REFUNDED"]),
    trackingCode: z.string().optional(),
  }),
});

adminOrdersRouter.get("/", adminOrderController.list);
adminOrdersRouter.patch("/:id", validate(updateStatusSchema), adminOrderController.updateStatus);
