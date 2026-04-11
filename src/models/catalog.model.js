const { QueryTypes } = require("sequelize");
const db = require("../config/database");

// Trae todos los tipos de clase
const getAllClassTypes = async () => {
  return await db.query("SELECT * FROM class_types ORDER BY name", {
    type: QueryTypes.SELECT,
  });
};

// Trae todos los instructores
const getAllInstructors = async () => {
  return await db.query("SELECT * FROM instructors ORDER BY name", {
    type: QueryTypes.SELECT,
  });
};

module.exports = { getAllClassTypes, getAllInstructors };
