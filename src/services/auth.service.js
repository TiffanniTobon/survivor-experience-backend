const bcrypt = require('bcryptjs'); // Librería para hashear y comparar contraseñas
const jwt = require('jsonwebtoken'); // Librería para crear y verificar tokens JWT



// Hashea la contraseña antes de guardarla en la BD
// Recibe: password en texto plano
// Retorna: string hasheado con bcrypt (salt rounds: 10)
 const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
// Compara la contraseña que escribe el usuario con la que está hasheada en la BD
// Recibe: password (lo que escribió el usuario), hashedPassword (lo que está en BD)
// Retorna: true si coinciden, false si no
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Genera un token JWT con la info del usuario
// Recibe: objeto user con id, email y role
// Retorna: string del token firmado
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // Payload: datos que viajan en el token
    process.env.JWT_SECRET,                              // Clave secreta desde .env
    { expiresIn: '8h' }                                  // El token expira en 8 horas
  );

};

module.exports = { comparePassword, generateToken, hashPassword };