const { z } = require("zod");

const reservationSchema = z.object({
  class_id: z.coerce.number().int().positive(),
  position_id: z.coerce.number().int().positive(),
});

module.exports = { reservationSchema };
