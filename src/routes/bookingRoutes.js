import express from "express";
import {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBooking);
router.post("/", authenticate, createBooking);
router.put("/:id", authenticate, updateBooking);
router.delete("/:id", authenticate, deleteBooking);

export default router;
