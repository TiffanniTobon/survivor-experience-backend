const { QueryTypes } = require("sequelize");
const db = require("../config/database");

// getAll — trae todas las clases, opcionalmente filtradas por semana
const getAll = async (date) => {
  if (date) {
    return await db.query(
      "SELECT * FROM classes WHERE WEEK(date) = WEEK(:date) ORDER BY date, start_time",
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

// create — inserta una nueva clase
const create = async ({
  name,
  instructor,
  room_id,
  date,
  start_time,
  end_time,
}) => {
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

module.exports = { getAll, getById, create, update, remove };
