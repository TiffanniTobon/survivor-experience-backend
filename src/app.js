// Importamos Express para crear el servidor y manejar rutas
const express = require("express");

// Importamos CORS para permitir que el frontend (otro origen) pueda hacer peticiones al backend
const cors = require("cors");

// Importa rutas de los endpoints
const authRoutes = require("./routes/auth.routes");
const classRoutes = require("./routes/class.routes");
const catalogRoutes = require("./routes/catalog.routes");
const positionRoutes = require("./routes/position.routes");
const reservationRoutes = require("./routes/reservation.routes");

// Creamos la instancia principal de la aplicación Express
const app = express();

// Habilitamos CORS en todas las rutas
app.use(cors());

// Permitimos que Express entienda peticiones con cuerpo en formato JSON
app.use(express.json());

// Registra todas las rutas de auth bajo el prefijo /auth
// Esto significa que el endpoint login queda disponible en: POST /auth/login
app.use("/auth", authRoutes);

//Rutas clases, catalogos, posiciones, reservas
app.use("/classes", classRoutes);
app.use("/catalogs", catalogRoutes);
app.use("/positions", positionRoutes);
app.use("/reservations", reservationRoutes);

// Ruta de prueba para verificar que el servidor está corriendo
app.get("/", (req, res) => {
  res.send("Survivor Experience API running");
});

// Exportamos la app para usarla en el archivo de entrada (server.js o index.js)
module.exports = app;
