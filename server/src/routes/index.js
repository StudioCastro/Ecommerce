import { Router } from "express";
import { productsRouter } from "./products.routes.js";
import { authRouter } from "./auth.routes.js";
import { addressesRouter } from "./addresses.routes.js";
import { ordersRouter } from "./orders.routes.js";
import { paymentsRouter } from "./payments.routes.js";
import { adminOrdersRouter } from "./admin.orders.routes.js";
import { contactRouter } from "./contact.routes.js";
import { newsletterRouter } from "./newsletter.routes.js";

export const router = Router();

// Health check — usado pelo Docker/monitoramento para saber se a API está de pé.
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/products", productsRouter);
router.use("/auth", authRouter);
router.use("/addresses", addressesRouter);
router.use("/orders", ordersRouter);
router.use("/payments", paymentsRouter);
router.use("/admin/orders", adminOrdersRouter);
router.use("/contact", contactRouter);
router.use("/newsletter", newsletterRouter);
