import express from "express";
import {
  getAllHosts,
  getHost,
  createHost,
  updateHost,
  deleteHost,
} from "../controllers/hostController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllHosts);
router.get("/:id", getHost);
router.post("/", authenticate, createHost);
router.put("/:id", authenticate, updateHost);
router.delete("/:id", authenticate, deleteHost);

export default router;
