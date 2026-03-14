// Importamos Express para crear el servidor y manejar rutas
const express = require('express')

// Importamos CORS para permitir que el frontend (otro origen) pueda hacer peticiones al backend
const cors = require('cors')

// Creamos la instancia principal de la aplicación Express
const app = express()

// Habilitamos CORS en todas las rutas
app.use(cors())

// Permitimos que Express entienda peticiones con cuerpo en formato JSON
app.use(express.json())

// Ruta de prueba para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('Survivor Experience API running')
})

// Exportamos la app para usarla en el archivo de entrada (server.js o index.js)
module.exports = app