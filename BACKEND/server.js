import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { downloadDatFile, parseDatFile } from "./helpers/ftpHelper.js";
import Reading from "./models/Readings.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//   Helper: 15-min slot floor

function get15MinSlotStart(d = new Date()) {
  const slot = new Date(d);
  slot.setSeconds(0, 0);
  const m = slot.getMinutes();
  // 0-14 -> 0, 15-29 -> 15, 30-44 -> 30, 45-59 -> 45
  const bucket = Math.floor(m / 15) * 15;
  slot.setMinutes(bucket);
  return slot;
}


//   Helper: Save if new slot only

async function saveIfNewSlot(payload) {
  const slotStart = get15MinSlotStart();
  const exists = await Reading.exists({ slotStart });

  if (exists) {
    // Cache HIT: same slot → skip save
    return { saved: false, slotStart };
  }

  // Cache MISS: save new record
  await Reading.create({ ...payload, slotStart, timestamp: new Date() });
  return { saved: true, slotStart };
}


// Fake Data API (auto-save every slot)
let dummyCounter = 0;

app.get("/api/fake-data", async (req, res) => {
  dummyCounter++;
  try {
    const fakeData = {
      device_id: Math.floor(1000000000 + Math.random() * 9000000000),
      device_state: Math.floor(Math.random() * 5),
      fw_version: Math.floor(Math.random() * 100),
      temperature: (28 + Math.random() * 4).toFixed(2),
      humidity: (65 + Math.random() * 10).toFixed(2),
      voltage_battery: Math.floor(1100 + Math.random() * 100),
      voltage_solar_panel: Math.floor(2400 + Math.random() * 200),
      running_current: Math.floor(120 + Math.random() * 10),
      avg_current: Math.floor(110 + Math.random() * 15),
      motor_speed: parseFloat((Math.random() * 0.1).toFixed(2)),
      panel_location: Math.floor(10 + Math.random() * 5),
      battery_percentage: Math.floor(240 + Math.random() * 15),
      connectivity_status: Math.floor(Math.random() * 2),
      error_code: Math.floor(Math.random() * 10),
      total_runtime: Math.floor(30 + Math.random() * 20),
      dbg_accel_output: Math.floor(Math.random() * 5000000000),
      dbg_gyro_output: Math.floor(Math.random() * 5000000000),
      dbg_motor_status_0: Math.floor(Math.random() * 2),
      dbg_motor_status_1: Math.floor(Math.random() * 2),
      general_status: Math.floor(Math.random() * 5),
      timestamp: new Date().toISOString()
    };

    const result = await saveIfNewSlot(fakeData);

    res.json(fakeData);
  } catch (err) {
    console.error("fake-data error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//   FTP-based API (optional)


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

//   History API

app.get("/api/machines/history", async (req, res) => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 });
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch readings history" });
  }
});


//   Start Server + DB Connect

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
connectDB();
