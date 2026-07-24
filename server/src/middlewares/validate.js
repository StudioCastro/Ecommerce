import { AppError } from "./errorHandler.js";

// Uso: router.post("/x", validate(createProductSchema), handler)
// O schema deve validar o formato { body, params, query } conforme necessário.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const messages = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      return next(new AppError(messages.join(" | "), 422));
    }

    // Substitui pelos dados já validados/tipados (ex: coerções do Zod)
    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    next();
  };
}
