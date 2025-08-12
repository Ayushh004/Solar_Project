const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

async function downloadDatFile(remoteFileName) {
    const client = new ftp.Client();
    const localPath = path.join(__dirname, remoteFileName);

    try {
        console.log("[DEBUG] FTP Connect karne ki koshish:", process.env.FTP_HOST);

        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        });

        console.log("[DEBUG] FTP Connected Successfully");

        if (process.env.FTP_DIR && process.env.FTP_DIR.trim() !== "") {
            console.log("[DEBUG] Directory change kar rahe hain:", process.env.FTP_DIR);
            await client.cd(process.env.FTP_DIR);
        } else {
            console.log("[DEBUG] FTP root directory me hi files dhoond rahe hain");
        }

        console.log("[DEBUG] File download start ho rahi hai:", remoteFileName);
        await client.downloadTo(localPath, remoteFileName);
        console.log("[DEBUG] File download complete. Local path:", localPath);

        return localPath;

    } catch (err) {
        console.error("[ERROR] FTP Error:", err.message);
        throw new Error("FTP Download failed: " + err.message);
    } finally {
        client.close();
    }
}

function parseDatFile(filePath) {
    console.log("[DEBUG] Parsing file:", filePath);

    if (!fs.existsSync(filePath)) {
        throw new Error("Downloaded file not found at " + filePath);
    }

    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 50) {
        throw new Error("File too small or corrupt");
    }

    return {
        device_id: buffer.readUInt32LE(0),
        device_state: buffer.readUInt8(4),
        fw_version: buffer.readUInt8(5),
        temperature: buffer.readUInt16LE(6) / 100,
        humidity: buffer.readUInt16LE(8) / 100,
        voltage_battery: buffer.readUInt16LE(10),
        voltage_solar_panel: buffer.readUInt16LE(12),
        running_current: buffer.readUInt16LE(14),
        avg_current: buffer.readUInt16LE(16),
        motor_speed: buffer.readUInt16LE(18) / 100,
        panel_location: buffer.readUInt16LE(20),
        battery_percentage: buffer.readUInt8(22),
        connectivity_status: buffer.readUInt8(23),
        error_code: buffer.readUInt32LE(24),
        total_runtime: buffer.readUInt32LE(28),
        dbg_accel_output: buffer.readUInt32LE(32),
        dbg_gyro_output: buffer.readUInt32LE(36),
        dbg_motor_status_0: buffer.readUInt32LE(40),
        dbg_motor_status_1: buffer.readUInt32LE(44),
        general_status: buffer.readUInt16LE(48)
    };
}

module.exports = { downloadDatFile, parseDatFile };
