const jwt = require('jsonwebtoken');

// Middleware que verifica si la petición trae un token JWT válido
// Se ejecuta antes del controlador en rutas protegidas
const verifyToken = (req, res, next) => {

  // El token llega en el header Authorization con formato: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraemos solo el token

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verifica y decodifica el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta los datos del usuario a la petición
    next();             // Permite continuar al controlador
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };