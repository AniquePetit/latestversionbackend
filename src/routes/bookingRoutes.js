import express from "express";
import {
  getAllBookings,
  getBooking,
  getBookingsByUserId, // Nieuwe functie voor filtering op userId
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Haal alle boekingen op, met optionele filter op userId
router.get("/", authenticate, getBookingsByUserId); // Filteren op userId is nu mogelijk
router.get("/:id", authenticate, getBooking);
router.post("/", authenticate, createBooking);
router.put("/:id", authenticate, updateBooking);
router.delete("/:id", authenticate, deleteBooking);

export default router;
