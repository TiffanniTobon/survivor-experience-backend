const reservationModel = require("../models/reservation.model");

// POST /reservations
// El usuario reserva una posición en una clase
// class_id y position_id ya vienen validados por validateBody(reservationSchema)
const create = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token JWT verificado
    const { class_id, position_id } = req.body;

    await reservationModel.create(userId, class_id, position_id);

    return res
      .status(201)
      .json({ message: "Reservation created successfully" });
  } catch (error) {
    // Errores controlados del modelo
    if (error.message === "POSITION_TAKEN") {
      return res.status(409).json({ message: "Position is already taken" });
    }
    if (error.message === "ALREADY_RESERVED") {
      return res
        .status(409)
        .json({ message: "You already have a reservation for this class" });
    }
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Position is already taken" });
    }
    console.error("Error creating reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /reservations/:id
// El usuario cancela su propia reserva
const cancel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await reservationModel.cancel(id, userId);

    return res
      .status(200)
      .json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /reservations/my
// Trae todas las reservas activas del usuario autenticado
const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await reservationModel.getMyReservations(userId);

    return res.status(200).json({
      message: "Reservations retrieved successfully",
      data: reservations,
    });
  } catch (error) {
    console.error("Error getting reservations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { create, cancel, getMyReservations };
