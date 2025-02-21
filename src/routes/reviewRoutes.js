import express from "express";
import {
  getAllReviews,
  getReview,
  getReviewsByUserIdAndPropertyId, // Nieuwe functie voor filtering
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Haal alle reviews op, met optionele filters voor userId en propertyId
router.get("/", authenticate, getReviewsByUserIdAndPropertyId); // Filteren op userId en propertyId is nu mogelijk
router.get("/:id", authenticate, getReview);
router.post("/", authenticate, createReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;
