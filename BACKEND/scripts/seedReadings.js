// scripts/seedReadings.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Reading from "../models/Readings.js";

dotenv.config();
//EK BAAR ME 300 ENTRIES DE DEGA 
const NUM_RECORDS = 300;

function get15MinSlotStart(date = new Date()) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  d.setMinutes(Math.floor(m / 15) * 15);
  return d;
}

function generateReading(index) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - index * 15); // go back in 15-min steps

  return {
    device_id: 4132004,
    device_state: Math.floor(Math.random() * 5),
    fw_version: Math.floor(Math.random() * 100),
    temperature: parseFloat((28 + Math.random() * 5).toFixed(2)),
    humidity: parseFloat((65 + Math.random() * 10).toFixed(2)),
    voltage_battery: Math.floor(1100 + Math.random() * 100),
    voltage_solar_panel: Math.floor(2400 + Math.random() * 200),
    running_current: Math.floor(120 + Math.random() * 10),
    avg_current: Math.floor(110 + Math.random() * 15),
    motor_speed: parseFloat((Math.random() * 0.1).toFixed(2)),
    panel_location: Math.floor(10 + Math.random() * 5),
    battery_percentage: Math.floor(Math.random() * 101),  // 0 to 100 inclusive
    connectivity_status: Math.floor(Math.random() * 2),
    error_code: Math.floor(Math.random() * 10),
    total_runtime: Math.floor(30 + Math.random() * 20),
    dbg_accel_output: Math.floor(Math.random() * 5000000000),
    dbg_gyro_output: Math.floor(Math.random() * 5000000000),
    dbg_motor_status_0: Math.floor(Math.random() * 2),
    dbg_motor_status_1: Math.floor(Math.random() * 2),
    general_status: Math.floor(Math.random() * 5),
    slotStart: get15MinSlotStart(now),
    timestamp: now,
  };
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const readings = [];
    for (let i = 0; i < NUM_RECORDS; i++) {
      readings.push(generateReading(i));
    }

    await Reading.insertMany(readings);
    console.log(`✅ Inserted ${NUM_RECORDS} synthetic readings`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
