const { QueryTypes } = require("sequelize");
const db = require("../config/database");

// Trae todas las posiciones de un salón con su estado para una clase específica
// Une la tabla positions con reservations para saber cuál está ocupada
// Si una posición tiene una reserva activa para esa clase → ocupada
// Si no → libre
const getPositionsByRoom = async (roomId, classId) => {
  return await db.query(
    `SELECT 
      p.id,
      p.number,
      p.room_id,
      CASE 
        WHEN r.id IS NOT NULL THEN 'occupied'
        ELSE 'free'
      END AS status,
      r.user_id
     FROM positions p
     LEFT JOIN reservations r 
       ON r.position_id = p.id 
       AND r.class_id = :classId
       AND r.status = 'active'
     WHERE p.room_id = :roomId
     ORDER BY p.number`,
    { replacements: { roomId, classId }, type: QueryTypes.SELECT },
  );
};

module.exports = { getPositionsByRoom };
