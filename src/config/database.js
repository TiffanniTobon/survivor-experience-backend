// Importamos Sequelize para manejar la conexión con la base de datos
const { Sequelize } = require('sequelize')

// Creamos la instancia de conexión usando las variables de entorno del archivo .env
// Así evitamos hardcodear credenciales en el código
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario de MySQL
  process.env.DB_PASSWORD, // Contraseña de MySQL
  {
    host: process.env.DB_HOST, // Host donde corre MySQL (normalmente localhost)
    dialect: 'mysql',          // Le decimos a Sequelize que usamos MySQL
    logging: false             // Desactivamos los logs de SQL en consola
  }
)

module.exports = sequelize