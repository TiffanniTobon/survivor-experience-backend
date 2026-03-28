const { findByIdNumber, createUser } = require('../models/user.model');
const { comparePassword, generateToken, hashPassword } = require('../services/auth.service');

// Maneja la petición POST /auth/login
const login = async (req, res) => {
  try {
    const { id_number, password } = req.body;

    if (!id_number || !password) {
      return res.status(400).json({ message: 'Identificación y contraseña son requeridas' });
    }

    const user = await findByIdNumber(id_number);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);

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

// Maneja la petición POST /auth/register
const register = async (req, res) => {
  try {
    const { name, id_number, email, password } = req.body;

    if (!name || !id_number || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const existing = await findByIdNumber(id_number);
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un usuario con esa identificación' });
    }

    const hashedPassword = await hashPassword(password);
    const newUserId = await createUser({ name, id_number, email, password: hashedPassword });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: newUserId
    });

  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login, register };