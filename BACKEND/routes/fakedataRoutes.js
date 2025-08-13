import express from "express";
import { getFakeData } from "../controllers/fakeDataController.js";

const router = express.Router();



// Fake Data API (auto-save every slot)
// GET /api/fake-data
router.get("/fake-data", getFakeData);

export default router;
