import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./errorHandler.js";

// Extrai e valida o Access Token do header Authorization: Bearer <token>.
// Anexa o payload decodificado (id, role) em req.user para uso nas próximas camadas.
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Token de acesso não informado.", 401));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch {
    next(new AppError("Token de acesso inválido ou expirado.", 401));
  }
}

// Uso: router.get("/admin/x", authenticate, authorize("ADMIN", "MANAGER"), handler)
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Usuário não autenticado.", 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Você não tem permissão para acessar este recurso.", 403));
    }
    next();
  };
}
