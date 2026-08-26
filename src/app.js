// Importamos Express para crear el servidor y manejar rutas
const express = require("express");

// Importamos CORS para permitir que el frontend (otro origen) pueda hacer peticiones al backend
const cors = require("cors");

// Helmet añade cabeceras de seguridad HTTP (CSP, HSTS, X-Content-Type-Options, etc.)
const helmet = require("helmet");

// Morgan registra cada request en consola (útil para debug y auditoría básica)
const morgan = require("morgan");

const { authLimiter } = require("./middlewares/rateLimiter.middleware");
const db = require("./config/database");

// Importa rutas de los endpoints
const authRoutes = require("./routes/auth.routes");
const classRoutes = require("./routes/class.routes");
const catalogRoutes = require("./routes/catalog.routes");
const positionRoutes = require("./routes/position.routes");
const reservationRoutes = require("./routes/reservation.routes");

// Creamos la instancia principal de la aplicación Express
const app = express();

// crossOriginResourcePolicy en "cross-origin" es necesario porque este API
// es consumido por un frontend en otro origen — el valor por defecto de helmet
// ("same-origin") bloquearía esas respuestas en el navegador del cliente.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Habilitamos CORS en todas las rutas
app.use(cors());

// Permitimos que Express entienda peticiones con cuerpo en formato JSON
app.use(express.json({ limit: "100kb" }));

// Limita intentos de login/registro por IP para frenar fuerza bruta
app.use("/auth", authLimiter);

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

// Endpoint de salud para orquestadores/balanceadores
app.get("/health", async (req, res) => {
  try {
    await db.authenticate();
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(503).json({ status: "unavailable" });
  }
});

// Ninguna ruta anterior respondió → 404 en JSON en vez del HTML por defecto de Express
app.use((req, res) => {
  res.status(404).json({ message: "Recurso no encontrado" });
});

// Manejador de errores global — SIEMPRE al final.
// Evita que un error no controlado devuelva el stack trace o detalles internos
// al cliente en producción.
app.use((err, req, res, next) => {
  console.error(err);
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    message: isProd ? "Error interno del servidor" : err.message,
  });
});

// Exportamos la app para usarla en el archivo de entrada (server.js o index.js)
module.exports = app;
