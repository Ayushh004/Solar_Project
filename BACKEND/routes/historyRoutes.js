import express from "express";
import { getHistory } from "../controllers/historyController.js";

const router = express.Router();

// GET /api/machines/history
router.get("/machines/history", getHistory);

export default router;
