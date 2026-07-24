import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Singleton do Prisma Client — evita abrir múltiplas conexões com o banco
// em ambiente de desenvolvimento com hot-reload.
export const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
