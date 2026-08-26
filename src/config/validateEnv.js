// Falla rápido si faltan variables de entorno obligatorias o si JWT_SECRET
// es demasiado corto para ser seguro, en vez de arrancar en un estado inseguro
// o fallar más tarde con un error de conexión confuso.
const REQUIRED_VARS = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD", "JWT_SECRET"];
const MIN_JWT_SECRET_LENGTH = 16;

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(", ")}. Revisa tu archivo .env`,
    );
  }

  if (process.env.JWT_SECRET.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET es demasiado corto (mínimo ${MIN_JWT_SECRET_LENGTH} caracteres). Usa un valor largo y aleatorio, especialmente en producción.`,
    );
  }
};

module.exports = { validateEnv };
