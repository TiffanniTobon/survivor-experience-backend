const express = require('express');         // Framework para crear el router
const router = express.Router();            // Instancia del router de Express
const { login } = require('../controllers/auth.controller'); // Importa el controlador de login
const { verifyToken } = require('../middlewares/auth.middleware');   
const { requireRole } = require('../middlewares/role.middleware');

// Define el endpoint POST /auth/login
// Cuando llegue una petición POST a /login, ejecuta la función login del controlador
router.post('/login', login);

// Ruta protegida de prueba — solo accesible con token válido y rol admin
router.get('/profile', verifyToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;