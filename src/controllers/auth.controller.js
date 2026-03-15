const { findByIdNumber } = require('../models/user.model');
const { comparePassword, generateToken } = require('../services/auth.service');

// Maneja la petición POST /auth/login
// Recibe: id_number y password en el body
// Retorna: token JWT + datos básicos del usuario, o mensaje de error
const login = async (req, res) => {
  try {
    const { id_number, password } = req.body; // Extrae id_number y password del body

    // Paso 1: Verificar que ambos campos llegaron
    if (!id_number || !password) {
      return res.status(400).json({ message: 'Identificación y contraseña son requeridas' });
    }

    // Paso 2: Buscar el usuario en la BD por número de identificación
    const user = await findByIdNumber(id_number);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Paso 3: Comparar la contraseña ingresada con la hasheada en BD
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Paso 4: Generar el token JWT
    const token = generateToken(user);

    // Paso 5: Responder con el token y datos básicos (nunca enviamos el password)
    return res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        id_number: user.id_number,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };