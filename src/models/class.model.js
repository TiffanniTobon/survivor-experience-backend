const { QueryTypes } = require("sequelize");
const db = require("../config/database");

// getAll — trae todas las clases con JOIN a class_types e instructors
const getAll = async (date) => {
  const baseQuery = `
    SELECT 
      c.id,
      ct.name AS name,
      i.name AS instructor,
      c.room_id,
      c.date,
      c.start_time,
      c.end_time,
      c.created_at,
      c.class_type_id,
      c.instructor_id
    FROM classes c
    JOIN class_types ct ON ct.id = c.class_type_id
    JOIN instructors i ON i.id = c.instructor_id
  `;

  if (date) {
    return await db.query(
      baseQuery +
        `WHERE c.date >= :date AND c.date < DATE_ADD(:date, INTERVAL 7 DAY)
       ORDER BY c.date, c.start_time`,
      { replacements: { date }, type: QueryTypes.SELECT },
    );
  }
  return await db.query(baseQuery + `ORDER BY c.date, c.start_time`, {
    type: QueryTypes.SELECT,
  });
};

// getById — busca una clase por id con JOIN
const getById = async (id) => {
  const rows = await db.query(
    `SELECT 
      c.id,
      ct.name AS name,
      i.name AS instructor,
      c.room_id,
      c.date,
      c.start_time,
      c.end_time,
      c.created_at,
      c.class_type_id,
      c.instructor_id
     FROM classes c
     JOIN class_types ct ON ct.id = c.class_type_id
     JOIN instructors i ON i.id = c.instructor_id
     WHERE c.id = :id`,
    { replacements: { id }, type: QueryTypes.SELECT },
  );
  return rows[0];
};

// checkRoomAvailability — verifica que el salón no tenga otra clase en ese horario
// dentro de una transacción, bloqueando las filas en conflicto (FOR UPDATE) para
// evitar que dos peticiones concurrentes pasen ambas la verificación antes de
// que la primera inserte (condición de carrera → doble reserva del mismo salón).
const checkRoomAvailability = async (
  room_id,
  date,
  start_time,
  end_time,
  transaction,
  excludeId = null,
) => {
  const rows = await db.query(
    `SELECT id FROM classes
     WHERE room_id = :room_id
     AND date = :date
     AND id != :excludeId
     AND (start_time < :end_time AND end_time > :start_time)
     FOR UPDATE`,
    {
      replacements: {
        room_id,
        date,
        start_time,
        end_time,
        excludeId: excludeId || 0,
      },
      type: QueryTypes.SELECT,
      transaction,
    },
  );
  return rows.length > 0;
};

// create — inserta una nueva clase con class_type_id e instructor_id
const create = async ({
  class_type_id,
  instructor_id,
  room_id,
  date,
  start_time,
  end_time,
}) => {
  return db.transaction(async (t) => {
    const isOccupied = await checkRoomAvailability(
      room_id,
      date,
      start_time,
      end_time,
      t,
    );
    if (isOccupied) throw new Error("ROOM_OCCUPIED");

    const [result] = await db.query(
      `INSERT INTO classes (class_type_id, instructor_id, room_id, date, start_time, end_time)
       VALUES (:class_type_id, :instructor_id, :room_id, :date, :start_time, :end_time)`,
      {
        replacements: {
          class_type_id,
          instructor_id,
          room_id,
          date,
          start_time,
          end_time,
        },
        transaction: t,
      },
    );
    return result;
  });
};

// update — actualiza una clase existente
const update = async (
  id,
  { class_type_id, instructor_id, room_id, date, start_time, end_time },
) => {
  return db.transaction(async (t) => {
    const isOccupied = await checkRoomAvailability(
      room_id,
      date,
      start_time,
      end_time,
      t,
      id,
    );
    if (isOccupied) throw new Error("ROOM_OCCUPIED");

    const [, meta] = await db.query(
      `UPDATE classes
       SET class_type_id = :class_type_id, instructor_id = :instructor_id,
           room_id = :room_id, date = :date, start_time = :start_time, end_time = :end_time
       WHERE id = :id`,
      {
        replacements: {
          class_type_id,
          instructor_id,
          room_id,
          date,
          start_time,
          end_time,
          id,
        },
        transaction: t,
      },
    );
    return meta;
  });
};

// remove — elimina una clase
const remove = async (id) => {
  const [, meta] = await db.query("DELETE FROM classes WHERE id = :id", {
    replacements: { id },
  });
  return meta;
};

module.exports = {
  getAll,
  getById,
  checkRoomAvailability,
  create,
  update,
  remove,
};
