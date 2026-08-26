const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservation.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateBody } = require("../middlewares/validate.middleware");
const { reservationSchema } = require("../validators/reservation.validator");

// Todas las rutas requieren estar autenticado
// Cualquier usuario (admin o user) puede reservar y cancelar

// GET /reservations/my → reservas activas del usuario autenticado
router.get("/my", verifyToken, reservationController.getMyReservations);

// POST /reservations → crear una reserva
router.post("/", verifyToken, validateBody(reservationSchema), reservationController.create);

// DELETE /reservations/:id → cancelar una reserva
router.delete("/:id", verifyToken, reservationController.cancel);

module.exports = router;
