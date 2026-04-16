const { QueryTypes } = require("sequelize");
const db = require("../config/database");

// Crea una nueva reserva
// Verifica primero que la posición no esté ocupada para esa clase
const create = async (userId, classId, positionId) => {
  // Verificamos que la posición no esté ya reservada para esa clase
  const existing = await db.query(
    `SELECT id FROM reservations 
     WHERE class_id = :classId 
     AND position_id = :positionId 
     AND status = 'active'`,
    { replacements: { classId, positionId }, type: QueryTypes.SELECT },
  );

  // Si ya existe una reserva activa para esa posición en esa clase, lanzamos error
  if (existing.length > 0) {
    throw new Error("POSITION_TAKEN");
  }

  // Verificamos que el usuario no tenga ya una reserva en esa clase
  const userReservation = await db.query(
    `SELECT id FROM reservations 
     WHERE class_id = :classId 
     AND user_id = :userId 
     AND status = 'active'`,
    { replacements: { classId, userId }, type: QueryTypes.SELECT },
  );

  if (userReservation.length > 0) {
    throw new Error("ALREADY_RESERVED");
  }

  // Creamos la reserva
  const [result] = await db.query(
    `INSERT INTO reservations (user_id, class_id, position_id, status) 
     VALUES (:userId, :classId, :positionId, 'active')`,
    { replacements: { userId, classId, positionId } },
  );

  return result;
};

// Cancela una reserva — solo el usuario dueño puede cancelarla
const cancel = async (reservationId, userId) => {
  const [, meta] = await db.query(
    `UPDATE reservations 
     SET status = 'cancelled' 
     WHERE id = :reservationId 
     AND user_id = :userId 
     AND status = 'active'`,
    { replacements: { reservationId, userId } },
  );
  return meta;
};

// Trae todas las reservas activas del usuario autenticado
// Hace JOIN con classes para traer el nombre, fecha y hora de cada clase
const getMyReservations = async (userId) => {
  return await db.query(
    `SELECT 
       r.id,
       r.status,
       r.created_at,
       c.id AS class_id,
       c.name AS class_name,
       c.date,
       c.start_time,
       c.end_time,
       c.instructor,
       p.number AS position_number,
       rm.name AS room_name
     FROM reservations r
     JOIN classes c ON c.id = r.class_id
     JOIN positions p ON p.id = r.position_id
     JOIN rooms rm ON rm.id = c.room_id
     WHERE r.user_id = :userId
     AND r.status = 'active'
     ORDER BY c.date, c.start_time`,
    { replacements: { userId }, type: QueryTypes.SELECT },
  );
};

module.exports = { create, cancel, getMyReservations };
