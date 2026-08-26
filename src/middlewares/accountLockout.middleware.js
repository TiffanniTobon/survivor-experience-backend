// Bloqueo de cuenta tras varios intentos de login fallidos consecutivos.
// Complementa a authLimiter (que limita por IP): esto limita por cuenta,
// así que sigue funcionando aunque el ataque venga de muchas IPs distintas.
//
// Nota de producción: el estado vive en memoria del proceso. Si el backend
// corre en más de una instancia detrás de un balanceador, hay que mover esto
// a un store compartido (Redis) para que el bloqueo sea consistente entre instancias.
const attempts = new Map(); // id_number -> { count, lockedUntil }

const MAX_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

const checkLocked = (req, res, next) => {
  const { id_number } = req.body;
  if (!id_number) return next();

  const record = attempts.get(id_number);
  if (record && record.lockedUntil && record.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return res.status(429).json({
      message: `Cuenta bloqueada temporalmente por intentos fallidos. Intenta de nuevo en ${minutesLeft} minuto(s).`,
    });
  }

  next();
};

const registerFailedAttempt = (id_number) => {
  if (!id_number) return;
  const record = attempts.get(id_number) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_WINDOW_MS;
    record.count = 0;
  }
  attempts.set(id_number, record);
};

const clearFailedAttempts = (id_number) => {
  if (!id_number) return;
  attempts.delete(id_number);
};

module.exports = { checkLocked, registerFailedAttempt, clearFailedAttempts };
