const rateLimit = require("express-rate-limit");

// Limita intentos de login/registro por IP.
// No afecta a un usuario normal: 10 peticiones cada 15 min es más que suficiente
// para equivocarse un par de veces sin llegar al límite.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});

module.exports = { authLimiter };
