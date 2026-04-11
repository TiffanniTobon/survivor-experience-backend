const catalogModel = require("../models/catalog.model");

// GET /catalogs/class-types → lista de tipos de clase
const getClassTypes = async (req, res) => {
  try {
    const classTypes = await catalogModel.getAllClassTypes();
    return res
      .status(200)
      .json({
        message: "Class types retrieved successfully",
        data: classTypes,
      });
  } catch (error) {
    console.error("Error getting class types:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /catalogs/instructors → lista de instructores
const getInstructors = async (req, res) => {
  try {
    const instructors = await catalogModel.getAllInstructors();
    return res
      .status(200)
      .json({
        message: "Instructors retrieved successfully",
        data: instructors,
      });
  } catch (error) {
    console.error("Error getting instructors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getClassTypes, getInstructors };
