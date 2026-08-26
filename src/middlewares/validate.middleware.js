// Middleware genérico de validación: recibe un schema de Zod y valida req.body.
// Si el body es inválido responde 400 con el detalle de qué campo falló.
// Si es válido, reemplaza req.body con los datos ya parseados/coercionados
// (por ejemplo, "5" pasa a ser el número 5 si el schema lo pide).
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
      .join("; ");
    return res.status(400).json({ message: "Datos inválidos", details });
  }

  req.body = result.data;
  next();
};

module.exports = { validateBody };
