import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { downloadDatFile, parseDatFile } from "./helpers/ftpHelper.js";
import Reading from "./models/Readings.js";
import fakeDataRoutes from "./routes/fakedataRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";


dotenv.config();

const app = express();


app.use(cors());
//iska kaam ye hai ki agr do user hai woh frontend chala rhe hai 
//toh woh dono user tumhare backend ko access kr sakte hai 
//agr tumne koi frontend link nhi daali cors() brackett me 


app.use(express.json());
//express.json() middleware is, raw JSON ko parse karke 
// JavaScript object me convert karega

app.use("/api/fakedataRoutes", fakeDataRoutes);
app.use("/api/historyRoutes", historyRoutes);

const PORT = process.env.PORT || 5000;

//   Start Server + DB Connect

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
connectDB();



























/*
app.get("/api/machines/latest", async (req, res) => {
  try {
    const filePath = await downloadDatFile("solar_panel_6.dat");
    const parsedData = parseDatFile(filePath);
    const newReading = new Reading(parsedData);
    await newReading.save();
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and parse .dat file" });
  }
});
*/


