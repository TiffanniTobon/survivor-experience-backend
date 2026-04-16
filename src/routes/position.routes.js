const express = require("express");
const router = express.Router();

const positionController = require("../controllers/position.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// GET /positions/:roomId?classId=xxx
// Cualquier usuario autenticado puede ver las posiciones
// tanto admin (para el mapa del panel) como usuario (para reservar)
router.get("/:roomId", verifyToken, positionController.getPositionsByRoom);

module.exports = router;
