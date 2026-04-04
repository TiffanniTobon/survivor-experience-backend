// El controller es el intermediario entre las rutas y el modelo
// Recibe la petición (req), llama al modelo, y devuelve la respuesta (res)
const classModel = require("../models/class.model");

// ─── GET ALL ─────────────────────────────────────────────────────────────────
// Maneja: GET /classes o GET /classes?date=2024-10-23
const getAll = async (req, res) => {
  try {
    // req.query contiene los parámetros que vienen en la URL después del ?
    // Ejemplo: /classes?date=2024-10-23 → req.query.date = "2024-10-23"
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
// Maneja: POST /classes
// Solo admin puede llegar aquí (el middleware lo garantiza en las rutas)
const create = async (req, res) => {
  try {
    // req.body contiene los datos que el admin envía en el body de la petición
    const { name, instructor, room_id, date, start_time, end_time } = req.body;

    // Validamos que todos los campos obligatorios lleguen
    if (!name || !instructor || !room_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newId = await classModel.create({
      name,
      instructor,
      room_id,
      date,
      start_time,
      end_time,
    });

    return res.status(201).json({
      message: "Class created successfully",
      data: { id: newId },
    });
  } catch (error) {
    console.error("Error creating class:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
// Maneja: PUT /classes/:id
// req.params.id contiene el id que viene en la URL: /classes/5 → id = "5"
const update = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero verificamos que la clase exista antes de intentar editarla
    const existing = await classModel.getById(id);
    if (!existing) {
      return res.status(404).json({ message: "Class not found" });
    }

    const { name, instructor, room_id, date, start_time, end_time } = req.body;

    if (!name || !instructor || !room_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await classModel.update(id, {
      name,
      instructor,
      room_id,
      date,
      start_time,
      end_time,
    });

    return res.status(200).json({ message: "Class updated successfully" });
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
// Maneja: DELETE /classes/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos que exista antes de eliminar
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
