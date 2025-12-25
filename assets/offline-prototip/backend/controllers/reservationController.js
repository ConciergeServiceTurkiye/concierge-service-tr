import createReservation from "../models/Reservation.js";
import { generateReservationId } from "../utils/generateId.js";

const DB = []; // TEMP: in-memory DB

export function create(req, res) {
  const id = generateReservationId();

  const reservation = createReservation({
    id,
    ...req.body
  });

  DB.unshift(reservation);

  res.status(201).json({
    success: true,
    reservation
  });
}

export function list(req, res) {
  res.json(DB);
}
