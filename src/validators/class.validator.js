const { z } = require("zod");

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// z.coerce.number() acepta tanto 5 como "5" — el frontend actual puede estar
// mandando cualquiera de los dos formatos y no queremos romperlo por eso.
const classSchema = z
  .object({
    class_type_id: z.coerce.number().int().positive(),
    instructor_id: z.coerce.number().int().positive(),
    room_id: z.coerce.number().int().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date debe tener formato YYYY-MM-DD"),
    start_time: z.string().regex(timeRegex, "start_time debe tener formato HH:mm"),
    end_time: z.string().regex(timeRegex, "end_time debe tener formato HH:mm"),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "end_time debe ser posterior a start_time",
    path: ["end_time"],
  });

module.exports = { classSchema };
