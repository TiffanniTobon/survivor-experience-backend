const positionModel = require("../models/position.model");

// GET /positions/:roomId?classId=xxx
// Trae todas las posiciones de un salón con su estado (free/occupied)
// roomId  → id del salón (1=Cycling, 2=Cardio Step)
// classId → id de la clase para saber qué posiciones están reservadas
const getPositionsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { classId } = req.query;

    // classId es obligatorio — sin él no sabemos qué reservas considerar
    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const positions = await positionModel.getPositionsByRoom(roomId, classId);

    return res.status(200).json({
      message: "Positions retrieved successfully",
      data: positions,
    });
  } catch (error) {
    console.error("Error getting positions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getPositionsByRoom };
