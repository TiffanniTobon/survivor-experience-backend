// Cargamos las variables de entorno desde el archivo .env
require('dotenv').config()

const { validateEnv } = require('./config/validateEnv')

// Falla rápido si falta configuración obligatoria o es insegura
try {
  validateEnv()
} catch (error) {
  console.error('Configuración inválida:', error.message)
  process.exit(1)
}

// Importamos la app de Express y la conexión a la base de datos
const app = require('./app')
const sequelize = require('./config/database')

const PORT = process.env.PORT || 3000

// Verificamos la conexión a la base de datos y arrancamos el servidor
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })
  