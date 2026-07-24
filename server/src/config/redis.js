import Redis from "ioredis";
import { env } from "./env.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  console.error("Erro na conexão com o Redis:", err.message);
});

redis.on("connect", () => {
  console.log("✅ Conectado ao Redis");
});
