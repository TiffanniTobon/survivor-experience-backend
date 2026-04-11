const express = require("express");
const router = express.Router();

const catalogController = require("../controllers/catalog.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Ambas rutas requieren estar autenticado
// GET /catalogs/class-types → lista de tipos de clase
router.get("/class-types", verifyToken, catalogController.getClassTypes);

// GET /catalogs/instructors → lista de instructores
router.get("/instructors", verifyToken, catalogController.getInstructors);

module.exports = router;
