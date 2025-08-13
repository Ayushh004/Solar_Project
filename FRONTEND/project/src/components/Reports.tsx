import React, { useEffect, useRef, useState } from 'react';
import './Reports.css';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const Reports: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const runtimeChartRef = useRef<HTMLCanvasElement>(null);
  const accelGyroChartRef = useRef<HTMLCanvasElement>(null);
  const errorCodeChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const now = Date.now();
    const cached = localStorage.getItem('reportData');
    const cachedTime = localStorage.getItem('reportDataTime');

    if (cached && cachedTime && now - parseInt(cachedTime) < 15 * 60 * 1000) {
      setData(JSON.parse(cached));
    } else {
      //https://solar-project-backend.onrender.com
      fetch('http://localhost:5000/api/fakedataRoutes/fake-data')
        .then(res => res.json())
        .then(json => {
          setData(json);
          localStorage.setItem('reportData', JSON.stringify(json));
          localStorage.setItem('reportDataTime', now.toString());
        })
        .catch(err => console.error('Failed to fetch report data:', err));
    }
  }, []);

  useEffect(() => {
    if (!data) return;

    const charts: ChartJS[] = [];

    if (runtimeChartRef.current) {
      charts.push(
        new ChartJS(runtimeChartRef.current, {
          type: 'line',
          data: {
            labels: ['10m', '5m', 'Now'],
            datasets: [{
              label: 'Runtime',
              data: [data.total_runtime - 5, data.total_runtime - 2, data.total_runtime],
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46,204,113,0.2)',
              tension: 0.3,
              fill: true,
            }],
          },
          options: { responsive: true, maintainAspectRatio: false },
        })
      );
    }

    if (accelGyroChartRef.current) {
      charts.push(
        new ChartJS(accelGyroChartRef.current, {
          type: 'bar',
          data: {
            labels: ['DBG Accel', 'DBG Gyro'],
            datasets: [{
              label: 'Debug',
              data: [data.dbg_accel_output, data.dbg_gyro_output],
              backgroundColor: ['#3498db', '#9b59b6'],
              borderRadius: 6,
            }],
          },
          options: { responsive: true, maintainAspectRatio: false },
        })
      );
    }

    if (errorCodeChartRef.current) {
      charts.push(
        new ChartJS(errorCodeChartRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Error', 'OK'],
            datasets: [{
              data: [data.error_code, 1 - data.error_code],
              backgroundColor: ['#e74c3c', '#2ecc71'],
              cutout: '70%',
            }],
          },
          options: {
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
              centerText: { text: `${data.error_code}` },
            },
            maintainAspectRatio: false,
          },
        })
      );
    }

    return () => charts.forEach(c => c.destroy());
  }, [data]);

  if (!data) return <p>Loading data please wait...</p>;

  return (
    <div className="reports fade-in">
      <h2>Reports</h2>
<p>Visual insights into runtime, error codes, and sensor outputs from recent operations.</p>


      <div className="reports-grid">
        <div className="report-section no-bg">
          <div className="chart-title">Total Runtime</div>
          <div className="chart-container"><canvas ref={runtimeChartRef}></canvas></div>
        </div>
        <div className="report-section no-bg">
          <div className="chart-title">DBG Accel + Gyro Output</div>
          <div className="chart-container"><canvas ref={accelGyroChartRef}></canvas></div>
        </div>
        <div className="report-section no-bg">
          <div className="chart-title">Error Code</div>
          <div className="chart-container"><canvas ref={errorCodeChartRef}></canvas></div>
        </div>
      </div>

      <div className="report-section full-width">
        <h3>Performance Metrics</h3>
        <table className="data-table">
          <tbody>
            <tr><td>Error Code</td><td>{data.error_code}</td></tr>
            <tr><td>Total Runtime</td><td>{data.total_runtime}</td></tr>
            <tr><td>DBG Accel Output</td><td>{data.dbg_accel_output}</td></tr>
            <tr><td>DBG Gyro Output</td><td>{data.dbg_gyro_output}</td></tr>
            <tr><td>DBG Motor Status 0</td><td>{data.dbg_motor_status_0}</td></tr>
            <tr><td>DBG Motor Status 1</td><td>{data.dbg_motor_status_1}</td></tr>
            <tr><td>General Status</td><td>{data.general_status}</td></tr>
            <tr><td>Time Stamp</td><td>{new Date(data.timestamp).toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
