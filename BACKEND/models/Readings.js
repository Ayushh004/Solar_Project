import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  slotStart: { type: Date, index: true },
  device_id: Number,
  device_state: Number,
  fw_version: Number,
  temperature: Number,
  humidity: Number,
  voltage_battery: Number,
  voltage_solar_panel: Number,
  running_current: Number,
  avg_current: Number,
  motor_speed: Number,
  panel_location: Number,
  battery_percentage: Number,
  connectivity_status: Number,
  error_code: Number,
  total_runtime: Number,
  dbg_accel_output: Number,
  dbg_gyro_output: Number,
  dbg_motor_status_0: Number,
  dbg_motor_status_1: Number,
  general_status: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Reading", readingSchema);
