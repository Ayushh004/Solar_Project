// src/components/AIInteligence.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./AIInteligence.css";

type AnomalyRow = { timestamp: string; is_anomaly: number };
type ForecastResp = { timestamp: string; predicted_battery_pct: number };

// NEW: Health API response
type HealthResp = {
  status: "good" | "warning" | "critical";
  color: "green" | "yellow" | "red";
  summary: string;
  last_seen: string | null;
  metrics: {
    battery_percentage?: number;
    temperature?: number;
    motor_speed?: number;
    connectivity_status?: number;
    error_code?: number;
  };
};

const ML_BASE = (import.meta as any).env?.VITE_ML_BASE || "http://localhost:8000";

function useLiveML() {
  const [loading, setLoading] = useState(true);
  const [anomaly, setAnomaly] = useState<AnomalyRow[]>([]);
  const [forecast, setForecast] = useState<ForecastResp | null>(null);
  const [health, setHealth] = useState<HealthResp | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNow = async () => {
    setLoading(true);
    try {
      const [aRes, fRes, hRes] = await Promise.all([
        fetch(`${ML_BASE}/api/predict/anomaly`),
        fetch(`${ML_BASE}/api/predict/forecast`),
        fetch(`${ML_BASE}/api/health`),
      ]);

      const [aJson, fJson, hJson] = await Promise.all([
        aRes.ok ? aRes.json() : Promise.resolve([]),
        fRes.ok ? fRes.json() : Promise.resolve(null),
        hRes.ok ? hRes.json() : Promise.resolve(null),
      ]);

      setAnomaly((aJson || []) as AnomalyRow[]);
      setForecast((fJson || null) as ForecastResp | null);
      setHealth((hJson || null) as HealthResp | null);

      setLastUpdated(new Date()); // live time
    } catch (e) {
      console.error("ML fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNow();
  }, []);

  return { loading, anomaly, forecast, health, lastUpdated, refresh: fetchNow };
}

// helper to use inline CSS strings
function toStyle(s: string): React.CSSProperties {
  return Object.fromEntries(
    s.split(";").map(kv => kv.trim()).filter(Boolean).map(kv => {
      const [k, v] = kv.split(":");
      const camel = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return [camel, v.trim()];
    })
  ) as React.CSSProperties;
}

const AIInteligence: React.FC = () => {
  const { loading, anomaly, forecast, health, lastUpdated, refresh } = useLiveML();

  const latestAnomaly = useMemo(() => {
    if (!anomaly?.length) return null;
    const last = anomaly[anomaly.length - 1];
    return last.is_anomaly === -1 ? "⚠️ Anomaly" : "✅ Normal";
  }, [anomaly]);

  // Health card colors
  const healthBg =
    health?.color === "red" ? "#fef2f2" :
    health?.color === "yellow" ? "#fff7ed" :
    health?.color === "green" ? "#ecfdf5" : "#f8fafc";

  const healthBorder =
    health?.color === "red" ? "#fecaca" :
    health?.color === "yellow" ? "#fed7aa" :
    health?.color === "green" ? "#bbf7d0" : "#e5e7eb";

  const healthText =
    health?.color === "red" ? "#7f1d1d" :
    health?.color === "yellow" ? "#7c2d12" :
    health?.color === "green" ? "#065f46" : "#334155";

  return (
    <div className="ai-container">
      <h1 className="ai-page-title">AI INTELLIGENCE</h1>
      <p className="ai-subtitle">
        ML‑powered insights: anomaly detection, battery forecast, and health score.
      </p>

      <div className="ai-actions" style={{ marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={refresh}>Refresh ML Data</button>
        {lastUpdated && (
          <span className="ai-chip">Last updated: {lastUpdated.toLocaleString()}</span>
        )}
      </div>

      <div className="ai-grid" style={{ marginTop: 10 }}>
        {/* Battery Forecast */}
        <div className="ai-card">
          <h3>Battery Forecast</h3>
          {loading ? <p>Loading...</p> : forecast ? (
            <>
              <p className="ai-meta">At {new Date(forecast.timestamp).toLocaleString()}</p>
              <div className="ai-value">{forecast.predicted_battery_pct}%</div>
              <p className="ai-muted">Predicted battery percentage</p>
            </>
          ) : <p>No forecast available.</p>}
        </div>

        {/* NEW: Health Score (replaces Fault Risk card) */}
        <div
          className="ai-card health-card"
          style={{ background: healthBg, border: `1px solid ${healthBorder}` }}
        >
          <div className="health-head" style={{ color: healthText }}>
            <h3 style={{ margin: 0 }}>Health Score</h3>
            {health && (
              <span className={`health-pill ${health.color}`}>
                {health.status.toUpperCase()}
              </span>
            )}
          </div>

          {loading && !health ? (
            <p>Loading...</p>
          ) : health ? (
            <>
              <p className="ai-muted" style={{ marginTop: 6, color: healthText }}>
                {health.summary}
              </p>

              {/* 4 key parameters */}
              <div className="health-grid">
                <div className="health-kv">
                  <span className="k">Battery %</span>
                  <span className="v">{health.metrics.battery_percentage ?? "—"}%</span>
                </div>
                <div className="health-kv">
                  <span className="k">Error Code</span>
                  <span className="v">{health.metrics.error_code ?? "—"}</span>
                </div>
                <div className="health-kv">
                  <span className="k">Connectivity</span>
                  <span className="v">
                    {health.metrics.connectivity_status === 0 ? "Offline" :
                     health.metrics.connectivity_status === 1 ? "Online" : "—"}
                  </span>
                </div>
                <div className="health-kv">
                  <span className="k">Temp (°C)</span>
                  <span className="v">{health.metrics.temperature ?? "—"}</span>
                </div>
              </div>

              {/* last seen */}
              {health.last_seen && (
                <small className="ai-meta">
                  Last data: {new Date(health.last_seen).toLocaleString()}
                </small>
              )}
            </>
          ) : (
            <p>No health data available.</p>
          )}
        </div>

        {/* Anomaly Detection */}
        <div className="ai-card">
          <h3>Anomaly Detection</h3>
          {loading ? <p>Loading...</p> : anomaly?.length ? (
            <>
              <div className="ai-anomaly-status">{latestAnomaly}</div>
              <div className="ai-anomaly-list">
                {anomaly.slice(-10).reverse().map((row, i) => (
                  <div key={i} className="ai-anomaly-item">
                    <span>{new Date(row.timestamp).toLocaleString()}</span>
                    <span>{row.is_anomaly === -1 ? "⚠️" : "✅"}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p>No anomaly data.</p>}
        </div>
      </div>
    </div>
  );
};

export default AIInteligence;
