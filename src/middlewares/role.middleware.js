// Middleware que verifica si el usuario tiene el rol requerido
// Se usa DESPUÉS de verifyToken, porque necesita req.user que ese middleware adjunta
const requireRole = (...roles) => {
  return (req, res, next) => {

    // Verifica si el rol del usuario está dentro de los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next(); // Rol válido, continúa al controlador
  };
};

module.exports = { requireRole };