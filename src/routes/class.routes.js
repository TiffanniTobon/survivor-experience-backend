const express = require("express");
const router = express.Router();

// Importamos el controller que tiene la lógica de cada endpoint
const classController = require("../controllers/class.controller");

// Importamos los middlewares de autenticación y rol
// verifyToken → verifica que el usuario esté autenticado (tiene JWT válido)
// requireRole → verifica que el usuario tenga el rol correcto
const { verifyToken } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

// ─── RUTAS PÚBLICAS (solo requieren estar autenticado) ────────────────────────
// GET /classes        → trae todas las clases
// GET /classes?date=  → filtra por semana
// Tanto admin como usuario pueden ver el cronograma
router.get("/", verifyToken, classController.getAll);

// ─── RUTAS SOLO ADMIN ─────────────────────────────────────────────────────────
// Los dos middlewares se ejecutan en orden:
// 1. verifyToken → ¿tiene token válido?
// 2. requireRole('admin') → ¿su rol es admin?
// Si alguno falla, la petición se rechaza antes de llegar al controller

// POST /classes → crear una clase nueva
router.post("/", verifyToken, requireRole("admin"), classController.create);

// PUT /classes/:id → editar una clase existente
router.put("/:id", verifyToken, requireRole("admin"), classController.update);

// DELETE /classes/:id → eliminar una clase
router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  classController.remove,
);

module.exports = router;
