const { QueryTypes } = require("sequelize");
const db = require("../config/database");

// getAll — trae todas las clases, opcionalmente filtradas por semana
const getAll = async (date) => {
  if (date) {
    return await db.query(
      `SELECT * FROM classes 
       WHERE date >= :date 
       AND date < DATE_ADD(:date, INTERVAL 7 DAY)
       ORDER BY date, start_time`,
      { replacements: { date }, type: QueryTypes.SELECT },
    );
  }
  return await db.query("SELECT * FROM classes ORDER BY date, start_time", {
    type: QueryTypes.SELECT,
  });
};

// getById — busca una clase por id
const getById = async (id) => {
  const rows = await db.query("SELECT * FROM classes WHERE id = :id", {
    replacements: { id },
    type: QueryTypes.SELECT,
  });
  return rows[0];
};

// checkRoomAvailability — verifica que el salón no tenga otra clase
// en el mismo día con horario traslapado
// excludeId se usa en el update para excluir la clase que se está editando
const checkRoomAvailability = async (
  room_id,
  date,
  start_time,
  end_time,
  excludeId = null,
) => {
  const rows = await db.query(
    `SELECT id FROM classes 
     WHERE room_id = :room_id 
     AND date = :date
     AND id != :excludeId
     AND (
       (start_time < :end_time AND end_time > :start_time)
     )`,
    {
      replacements: {
        room_id,
        date,
        start_time,
        end_time,
        excludeId: excludeId || 0,
      },
      type: QueryTypes.SELECT,
    },
  );
  return rows.length > 0; // true = salón ocupado
};

// create — inserta una nueva clase
const create = async ({
  name,
  instructor,
  room_id,
  date,
  start_time,
  end_time,
}) => {
  // Verificar disponibilidad del salón
  const isOccupied = await checkRoomAvailability(
    room_id,
    date,
    start_time,
    end_time,
  );
  if (isOccupied) {
    throw new Error("ROOM_OCCUPIED");
  }

  const [result] = await db.query(
    "INSERT INTO classes (name, instructor, room_id, date, start_time, end_time) VALUES (:name, :instructor, :room_id, :date, :start_time, :end_time)",
    { replacements: { name, instructor, room_id, date, start_time, end_time } },
  );
  return result;
};

// update — actualiza una clase existente
const update = async (
  id,
  { name, instructor, room_id, date, start_time, end_time },
) => {
  // Verificar disponibilidad del salón excluyendo la clase actual
  const isOccupied = await checkRoomAvailability(
    room_id,
    date,
    start_time,
    end_time,
    id,
  );
  if (isOccupied) {
    throw new Error("ROOM_OCCUPIED");
  }

  const [, meta] = await db.query(
    "UPDATE classes SET name = :name, instructor = :instructor, room_id = :room_id, date = :date, start_time = :start_time, end_time = :end_time WHERE id = :id",
    {
      replacements: {
        name,
        instructor,
        room_id,
        date,
        start_time,
        end_time,
        id,
      },
    },
  );
  return meta;
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
