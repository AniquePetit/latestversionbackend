import express from "express";
import {
  getAllAmenities,
  getAmenity,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../controllers/amenityController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllAmenities);
router.get("/:id", getAmenity);
router.post("/", authenticate, createAmenity);
router.put("/:id", authenticate, updateAmenity);
router.delete("/:id", authenticate, deleteAmenity);

export default router;
