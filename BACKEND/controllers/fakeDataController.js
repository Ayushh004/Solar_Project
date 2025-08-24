import Reading from "../models/Readings.js";




//  15 min ki bucket slot ban rhi hai
function get15MinSlotStart(d = new Date()) {
  const slot = new Date(d);
  slot.setSeconds(0, 0);
  const m = slot.getMinutes();
   // 0-14 -> 0, 15-29 -> 15, 30-44 -> 30
  const bucket = Math.floor(m / 15) * 15;
  slot.setMinutes(bucket);
  return slot;
}


//   Helper: Save if new slot only

async function saveIfNewSlot(payload) {
  const slotStart = get15MinSlotStart();
  const exists = await Reading.exists({ slotStart });
  if (exists) return { saved: false, slotStart };
  // Cache HIT: same slot → skip save
  await Reading.create({ ...payload, slotStart, timestamp: new Date() });
   // Cache MISS: save new record
  return { saved: true, slotStart };
}

export const getFakeData = async (req, res) => {
  try {
    const fakeData = {
      device_id: 4132004,
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
      battery_percentage: Math.floor(Math.random() * 101),  // 0 to 100 inclusive
      connectivity_status: Math.floor(Math.random() * 2),
      error_code: Math.floor(Math.random() * 10),
      total_runtime: Math.floor(30 + Math.random() * 20),
      dbg_accel_output: Math.floor(Math.random() * 5000000000),
      dbg_gyro_output: Math.floor(Math.random() * 5000000000),
      dbg_motor_status_0: Math.floor(Math.random() * 2),
      dbg_motor_status_1: Math.floor(Math.random() * 2),
      general_status: Math.floor(Math.random() * 5),
      timestamp: new Date().toISOString(),
    };

    await saveIfNewSlot(fakeData);
    res.json(fakeData);
  } catch (err) {
    console.error("fake-data error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
