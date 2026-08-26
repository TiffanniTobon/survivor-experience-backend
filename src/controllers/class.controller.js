const classModel = require("../models/class.model");

// ─── GET ALL ─────────────────────────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const { date } = req.query;
    const classes = await classModel.getAll(date);
    return res.status(200).json({
      message: "Classes retrieved successfully",
      data: classes,
    });
  } catch (error) {
    console.error("Error getting classes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
// Los campos ya vienen validados (tipos, formato de fecha/hora) por validateBody(classSchema)
const create = async (req, res) => {
  try {
    const {
      class_type_id,
      instructor_id,
      room_id,
      date,
      start_time,
      end_time,
    } = req.body;

    const newId = await classModel.create({
      class_type_id,
      instructor_id,
      room_id,
      date,
      start_time,
      end_time,
    });

    // Traemos la clase recién creada con su nombre e instructor completos
    const newClass = await classModel.getById(newId);

    return res.status(201).json({
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    if (error.message === "ROOM_OCCUPIED") {
      return res
        .status(409)
        .json({ message: "Room is already occupied at that time" });
    }
    console.error("Error creating class:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await classModel.getById(id);
    if (!existing) {
      return res.status(404).json({ message: "Class not found" });
    }

    const {
      class_type_id,
      instructor_id,
      room_id,
      date,
      start_time,
      end_time,
    } = req.body;

    await classModel.update(id, {
      class_type_id,
      instructor_id,
      room_id,
      date,
      start_time,
      end_time,
    });

    return res.status(200).json({ message: "Class updated successfully" });
  } catch (error) {
    if (error.message === "ROOM_OCCUPIED") {
      return res
        .status(409)
        .json({ message: "Room is already occupied at that time" });
    }
    console.error("Error updating class:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await classModel.getById(id);
    if (!existing) {
      return res.status(404).json({ message: "Class not found" });
    }

    await classModel.remove(id);
    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAll, create, update, remove };
