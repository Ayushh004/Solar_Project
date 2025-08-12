import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

interface AdminPanelProps {
  onCityZoneUpdate: (city: string, zone: string) => void;
}

interface ZoneInfo {
  description: string;
  manager: string;
  lastMaintenance: string;
}

interface PlantData {
  [city: string]: {
    zones: {
      [zone: string]: ZoneInfo;
    };
  };
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onCityZoneUpdate }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [zoneInfo, setZoneInfo] = useState<ZoneInfo | null>(null);

  const plantData: PlantData = {
    "New York": {
      zones: {
        "Zone 1": {
          description: "Zone 1 in New York - rooftop solar panels, 200 kW capacity.",
          manager: "John Doe",
          lastMaintenance: "2025-06-15"
        },
        "Zone 2": {
          description: "Zone 2 in New York - ground mounted panels, 150 kW capacity.",
          manager: "Jane Smith",
          lastMaintenance: "2025-05-20"
        }
      }
    },
    "San Francisco": {
      zones: {
        "Zone A": {
          description: "Zone A in San Francisco - solar farm near bay area, 300 kW.",
          manager: "Alice Johnson",
          lastMaintenance: "2025-07-01"
        },
        "Zone B": {
          description: "Zone B in San Francisco - urban solar panels, 100 kW.",
          manager: "Bob Lee",
          lastMaintenance: "2025-06-10"
        }
      }
    },
    "Berlin": {
      zones: {
        "Zone Alpha": {
          description: "Zone Alpha in Berlin - industrial rooftop, 250 kW.",
          manager: "Clara Schmidt",
          lastMaintenance: "2025-06-25"
        },
        "Zone Beta": {
          description: "Zone Beta in Berlin - suburban solar array, 180 kW.",
          manager: "Max Müller",
          lastMaintenance: "2025-05-30"
        }
      }
    }
  };

  useEffect(() => {
    if (selectedCity && selectedZone && plantData[selectedCity]?.zones[selectedZone]) {
      setZoneInfo(plantData[selectedCity].zones[selectedZone]);
    } else {
      setZoneInfo(null);
    }
  }, [selectedCity, selectedZone]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setSelectedZone('');
    setZoneInfo(null);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZone(e.target.value);
  };

  const handleSaveForm = (formType: string) => {
    if (formType === 'plant' && selectedCity && selectedZone) {
      onCityZoneUpdate(selectedCity, selectedZone);
      alert(`Plant & Zone settings saved:\nCity: ${selectedCity}\nZone: ${selectedZone}`);
    } else {
      alert(`${formType} settings saved successfully!`);
    }
  };

  return (
    <div className="admin-panel fade-in">
      <h2>Admin Panel</h2>
      <p>Configure your plant system parameters and settings.</p>

      <div className="admin-grid">
        {/* Solar Plant Card */}
        <div className="admin-card" id="solar-plant">
          <div className="admin-icon">🌞</div>
          <h3>Solar Plant</h3>
          <form>
            <div className="form-group" id="city-location-plant">
              <label htmlFor="citySelect">City Location (Plant)</label>
              <select
                id="citySelect"
                value={selectedCity}
                onChange={handleCityChange}
              >
                <option value="">Select City</option>
                {Object.keys(plantData).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group" id="zone-sublocation">
              <label htmlFor="zoneSelect">Zone (Sublocation)</label>
              <select
                id="zoneSelect"
                value={selectedZone}
                onChange={handleZoneChange}
                disabled={!selectedCity}
              >
                <option value="">Select Zone</option>
                {selectedCity && plantData[selectedCity] &&
                  Object.keys(plantData[selectedCity].zones).map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
              </select>
            </div>

            <div className="zone-info">
              {zoneInfo ? (
                <>
                  <strong>Description:</strong> {zoneInfo.description}<br/>
                  <strong>Manager:</strong> {zoneInfo.manager}<br/>
                  <strong>Last Maintenance:</strong> {zoneInfo.lastMaintenance}
                </>
              ) : (
                'Please select a city and zone to see details.'
              )}
            </div>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleSaveForm('plant')}
            >
              Save Plant Settings
            </button>
          </form>
        </div>

        {/* Machine & User Management Card */}
        <div className="admin-card" id="machine-user-management">
          <div className="admin-icon">🖥️</div>
          <h3>Machine & User Management</h3>
          <form>
            <div className="form-group" id="machine-count">
              <label htmlFor="machineCount">Machine Count</label>
              <input
                type="number"
                id="machineCount"
                defaultValue="20"
                min="1"
                max="100"
              />
            </div>

            <div className="form-group" id="user-creation">
              <label htmlFor="userCreation">User Creation</label>
              <select id="userCreation" defaultValue="enabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="form-group" id="access-level">
              <label htmlFor="accessLevel">Access Level</label>
              <select id="accessLevel" defaultValue="admin">
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleSaveForm('Machine & User')}
            >
              Save Settings
            </button>
          </form>
        </div>

        {/* Company & Fleet Card */}
        <div className="admin-card" id="company-fleet">
          <div className="admin-icon">🏢</div>
          <h3>Company & Fleet</h3>
          <form>
            <div className="form-group" id="company-name">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                defaultValue="XYZ company"
              />
            </div>

            <div className="form-group" id="fleet-control">
              <label htmlFor="fleetControl">Fleet Control</label>
              <select id="fleetControl" defaultValue="automatic">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="form-group" id="customer-details">
              <label htmlFor="customerDetails">Customer Details</label>
              <input
                type="text"
                id="customerDetails"
                defaultValue="Customer A"
              />
            </div>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleSaveForm('Company & Fleet')}
            >
              Save Settings
            </button>
          </form>
        </div>

        {/* Schedules & Timing Card */}
        <div className="admin-card" id="schedules-timing">
          <div className="admin-icon">⏰</div>
          <h3>Schedules & Timing</h3>
          <form>
            <div className="form-group" id="service-schedule">
              <label htmlFor="serviceSchedule">Service Schedule</label>
              <input
                type="text"
                id="serviceSchedule"
                defaultValue="Monthly"
              />
            </div>

            <div className="form-group" id="cycle-time">
              <label htmlFor="cycleTime">Cycle Time (minutes)</label>
              <input
                type="number"
                id="cycleTime"
                defaultValue="30"
                min="1"
                max="120"
              />
            </div>

            <div className="form-group" id="schedule-mode">
              <label htmlFor="scheduleMode">Schedule Mode</label>
              <select id="scheduleMode" defaultValue="auto">
                <option value="auto">Auto</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleSaveForm('Schedules & Timing')}
            >
              Save Settings
            </button>
          </form>
        </div>

        {/* Panel & Device Configuration Card */}
        <div className="admin-card" id="panel-device-configuration">
          <div className="admin-icon">⚙️</div>
          <h3>Panel & Device Configuration</h3>
          <form>
            <div className="form-group" id="panel-configuration">
              <label htmlFor="panelConfig">Panel Configuration</label>
              <input
                type="text"
                id="panelConfig"
                defaultValue="Default"
              />
            </div>

            <div className="form-group" id="cycles-to-run">
              <label htmlFor="cycleToRun">Cycles to Run</label>
              <input
                type="number"
                id="cycleToRun"
                defaultValue="3"
                min="1"
                max="10"
              />
            </div>

            <div className="form-group" id="device-id">
              <label htmlFor="deviceId">Device ID</label>
              <input
                type="text"
                id="deviceId"
                defaultValue="DEV-001"
              />
            </div>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleSaveForm('Panel & Device')}
            >
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
