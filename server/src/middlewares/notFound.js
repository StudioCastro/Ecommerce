export function notFound(req, res) {
  res.status(404).json({
    error: { message: `Rota não encontrada: ${req.method} ${req.originalUrl}` },
  });
}
