import Reading from "../models/Readings.js";

export const getHistory = async (_req, res) => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 });
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch readings history" });
  }
};
