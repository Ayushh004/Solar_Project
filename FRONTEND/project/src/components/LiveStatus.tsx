import React, { useEffect, useRef, useState } from "react";
import "./LiveStatus.css";
import { API_BASE_URL } from "../config";
fetch(`${API_BASE_URL}/api/fake-data`)
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Chart,
  Plugin,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

/** Center text plugin for doughnut charts */
const centerTextPlugin: Plugin = {
  id: "centerText",
  afterDraw(chart, _args, pluginOptions) {
    const { ctx, chartArea } = chart as Chart;
    if (!chartArea) return;
    const text: string = (pluginOptions as any)?.text ?? "";
    if (!text) return;

    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 22px Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillStyle = "#2c3e50";
    ctx.fillText(text, x, y);
    ctx.restore();
  },
};
ChartJS.register(centerTextPlugin);

type Reading = {
  total_runtime: number;
  battery_percentage: number;
  running_current: number;
  avg_current: number;
  motor_speed: number;
  connectivity_status: 0 | 1;
  device_id: number;
  device_state: number;
  fw_version: number;
  temperature: string;
  humidity: string;
  voltage_battery: number;
  voltage_solar_panel: number;
  panel_location: number;
  error_code: number;
  dbg_accel_output: number;
  dbg_gyro_output: number;
  dbg_motor_status_0: number;
  dbg_motor_status_1: number;
  general_status: number;
  timestamp: string;
};

const toPct = (raw: number) =>
  Math.round(Math.max(0, Math.min(100, (Number(raw) / 255) * 100)));

const LiveStatus: React.FC = () => {
  const [data, setData] = useState<Reading | null>(null);

  const chargeRef = useRef<HTMLCanvasElement>(null);
  const batteryRef = useRef<HTMLCanvasElement>(null);
  const loraRef = useRef<HTMLCanvasElement>(null);
  const cleaningRef = useRef<HTMLCanvasElement>(null);

  const charts = useRef<{ charge?: Chart; battery?: Chart; lora?: Chart; clean?: Chart }>({});

  // ---- Fetch once every 15 minutes (no change to backend/logic) ----
  useEffect(() => {
    const now = Date.now();
    const cached = localStorage.getItem("liveData");
    const cachedTime = localStorage.getItem("liveDataTime");

    if (cached && cachedTime && now - parseInt(cachedTime) < 15 * 60 * 1000) {
      setData(JSON.parse(cached));
    } else {
      fetch("http://localhost:5000/api/fake-data")
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          localStorage.setItem("liveData", JSON.stringify(json));
          localStorage.setItem("liveDataTime", now.toString());
        })
        .catch((err) => console.error("Failed to fetch:", err));
    }
  }, []);

  // ---- Init / Update charts when data loads ----
  useEffect(() => {
    if (!data) return;

    const createOrUpdateChart = (
      key: keyof typeof charts.current,
      ref: React.RefObject<HTMLCanvasElement>,
      type: "line" | "doughnut",
      labels: string[],
      values: number[],
      colors: string[],
      centerText?: string
    ) => {
      if (!ref.current) return;

      if (charts.current[key]) {
        const chart = charts.current[key]!;
        (chart.data.datasets[0].data as number[]) = values;
        // @ts-ignore update center text
        chart.options.plugins = {
          ...(chart.options.plugins || {}),
          legend: { display: false },
          centerText: { text: centerText || "" },
        };
        chart.update();
        return;
      }

      charts.current[key] = new ChartJS(ref.current, {
        type,
        data: {
          labels,
          datasets: [
            {
              data: values,
              borderColor: colors[0],
              backgroundColor: type === "doughnut" ? colors : colors[0],
              fill: type === "line",
              tension: type === "line" ? 0.35 : 0,
              borderWidth: type === "line" ? 3 : 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: 0 },
          plugins: {
            legend: { display: false },
            // @ts-ignore custom plugin text
            centerText: { text: centerText || "" },
            tooltip: { enabled: true },
          },
          cutout: type === "doughnut" ? "72%" : undefined,
          scales:
            type === "line"
              ? {
                  x: { grid: { display: false } },
                  y: { grid: { color: "rgba(0,0,0,0.06)" } },
                }
              : undefined,
        },
      });
    };

    createOrUpdateChart(
      "charge",
      chargeRef,
      "line",
      ["Avg Current", "Running Current"],
      [data.avg_current, data.running_current],
      ["#2980b9"]
    );

    const batt = toPct(data.battery_percentage);
    createOrUpdateChart(
      "battery",
      batteryRef,
      "doughnut",
      ["Battery", "Remaining"],
      [batt, 100 - batt],
      ["#3498db", "#ecf0f1"],
      `${batt}%`
    );

    const loraPct = data.connectivity_status ? 75 : 10;
    createOrUpdateChart(
      "lora",
      loraRef,
      "doughnut",
      ["Signal", "Loss"],
      [loraPct, 100 - loraPct],
      ["#1abc9c", "#ecf0f1"],
      `${loraPct}%`
    );

    const speedPct = Math.round((Number(data.motor_speed) || 0) * 1000);
    createOrUpdateChart(
      "clean",
      cleaningRef,
      "line",
      ["Now"],
      [speedPct],
      ["#e67e22"]
    );
  }, [data]);

  if (!data) return <p>Loading data please wait...</p>;

  const batteryPct = toPct(data.battery_percentage);

  return (
    <div className="live-status fade-in">
      <div className="page-head">
        <h2>Live Status</h2>
        <p>Real-time monitoring of system parameters and performance metrics.</p>
      </div>

      {/* KPI cards (unchanged logic) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Runtime</span>
          <span className="kpi-value">{data.total_runtime} min</span>
          <span className="kpi-trend up">+2.4%</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Battery %</span>
          <span className="kpi-value">{batteryPct}%</span>
          <span className="kpi-trend ok">Stable</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Current (mA)</span>
          <span className="kpi-value">{data.running_current}</span>
          <span className="kpi-trend down">-15%</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Motor Speed</span>
          <span className="kpi-value">{Number(data.motor_speed).toFixed(2)}</span>
          <span className="kpi-trend ok">Nominal</span>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Charging Current</div>
          <div className="chart-body">
            <canvas ref={chargeRef} className="chart-canvas" />
          </div>
        </div>

        <div className="chart-card doughnut">
          <div className="chart-title">Battery</div>
          <div className="chart-body">
            <canvas ref={batteryRef} className="chart-canvas" />
          </div>
        </div>

        <div className="chart-card doughnut">
          <div className="chart-title">LoRa Signal Strength</div>
          <div className="chart-body">
            <canvas ref={loraRef} className="chart-canvas" />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Cleaning Speed</div>
          <div className="chart-body">
            <canvas ref={cleaningRef} className="chart-canvas" />
          </div>
        </div>
      </div>

      {/* System Parameters table (do not touch) */}
      <div className="report-section full-width data-section">
        <h3>System Parameters</h3>
        <table className="data-table">
          <tbody>
  <tr id="Device ID"><td>Device ID</td><td>{data.device_id}</td></tr>
  <tr id="Device State"><td>Device State</td><td>{data.device_state}</td></tr>
  <tr id="FW Version"><td>FW Version</td><td>{data.fw_version}</td></tr>
  <tr id="Temperature"><td>Temperature</td><td>{data.temperature} °C</td></tr>
  <tr id="Humidity"><td>Humidity</td><td>{data.humidity} %</td></tr>
  <tr id="Voltage Battery"><td>Voltage Battery</td><td>{data.voltage_battery} mV</td></tr>
  <tr id="Voltage Solar Panel"><td>Voltage Solar Panel</td><td>{data.voltage_solar_panel} mV</td></tr>
  <tr id="Running Current"><td>Running Current</td><td>{data.running_current} mA</td></tr>
  <tr id="Avg Current"><td>Avg Current</td><td>{data.avg_current} mA</td></tr>
  <tr id="Motor Speed"><td>Motor Speed</td><td>{data.motor_speed}</td></tr>
  <tr id="Panel Location"><td>Panel Location</td><td>{data.panel_location}</td></tr>
  <tr id="Battery %"><td>Battery %</td><td>{batteryPct} %</td></tr>
  <tr id="Connectivity Status"><td>Connectivity Status</td><td>{data.connectivity_status ? "Online" : "Offline"}</td></tr>
  <tr id="Total Runtime"><td>Total Runtime</td><td>{data.total_runtime} min</td></tr>
  <tr id="DBG Accel Output"><td>DBG Accel Output</td><td>{data.dbg_accel_output}</td></tr>
  <tr id="DBG Gyro Output"><td>DBG Gyro Output</td><td>{data.dbg_gyro_output}</td></tr>
  <tr id="DBG Motor Status 0"><td>DBG Motor Status 0</td><td>{data.dbg_motor_status_0}</td></tr>
  <tr id="DBG Motor Status 1"><td>DBG Motor Status 1</td><td>{data.dbg_motor_status_1}</td></tr>
  <tr id="General Status"><td>General Status</td><td>{data.general_status}</td></tr>
  <tr id="Time Stamp"><td>Time Stamp</td><td>{new Date(data.timestamp).toLocaleString()}</td></tr>
</tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveStatus;
