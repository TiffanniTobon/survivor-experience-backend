const db = require('../config/database');

// Con QueryTypes.SELECT Sequelize retorna directamente el array de resultados
// NO desestructuramos con [rows] porque eso tomaría solo el primer elemento
const findByIdNumber = async (id_number) => {
  const rows = await db.query(
    'SELECT * FROM users WHERE id_number = :id_number',
    {
      replacements: { id_number },
      type: db.QueryTypes.SELECT
    }
  );
  return rows[0] || null;
};

module.exports = { findByIdNumber };