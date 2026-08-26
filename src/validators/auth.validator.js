const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2, "name debe tener al menos 2 caracteres").max(100),
  id_number: z.string().trim().min(3, "id_number debe tener al menos 3 caracteres").max(30),
  email: z.string().trim().toLowerCase().email("email inválido"),
  password: z.string().min(8, "password debe tener al menos 8 caracteres").max(100),
});

// El login es intencionalmente laxo: solo exige que los campos no estén vacíos.
// No debe filtrar por qué formato de id_number es "válido" — eso ayudaría
// a un atacante a distinguir cuentas existentes de inexistentes.
const loginSchema = z.object({
  id_number: z.string().trim().min(1, "id_number es requerido"),
  password: z.string().min(1, "password es requerido"),
});

module.exports = { registerSchema, loginSchema };
