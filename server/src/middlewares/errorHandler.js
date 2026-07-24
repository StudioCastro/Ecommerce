import { env } from "../config/env.js";

// Classe de erro de aplicação — services/controllers lançam isso para erros esperados
// (ex: "produto não encontrado", "estoque insuficiente"), diferenciando de bugs reais.
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Precisa ficar por último na cadeia de middlewares (4 parâmetros = Express reconhece como error handler).
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode ?? 500;
  const isOperational = err.isOperational ?? false;

  if (!isOperational) {
    // Erro não previsto — loga completo no servidor, mas não vaza detalhes internos ao cliente.
    console.error("Erro não tratado:", err);
  }

  res.status(statusCode).json({
    error: {
      message: isOperational ? err.message : "Erro interno do servidor.",
      ...(env.NODE_ENV === "development" && !isOperational ? { stack: err.stack } : {}),
    },
  });
}
