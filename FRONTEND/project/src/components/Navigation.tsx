import React, { useState } from 'react';
import { Settings, Activity, BarChart3, AlertTriangle, ChevronDown, Search } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');

  // ✅ Updated mapping: search term → element ID + tab name
const parameterMap: Record<string, { id: string; tab: string }> = {
  "Device ID": { id: "Device ID", tab: "live-status" },
  "Device State": { id: "Device State", tab: "live-status" },
  "FW Version": { id: "FW Version", tab: "live-status" },
  "Temperature": { id: "Temperature", tab: "live-status" },
  "Humidity": { id: "Humidity", tab: "live-status" },
  "Voltage Battery": { id: "Voltage Battery", tab: "live-status" },
  "Voltage Solar Panel": { id: "Voltage Solar Panel", tab: "live-status" },
  "Running Current": { id: "Running Current", tab: "live-status" },
  "Avg Current": { id: "Avg Current", tab: "live-status" },
  "Motor Speed": { id: "Motor Speed", tab: "live-status" },
  "Panel Location": { id: "Panel Location", tab: "live-status" },
  "Battery %": { id: "Battery %", tab: "live-status" },
  "Connectivity Status": { id: "Connectivity Status", tab: "live-status" },
  "Total Runtime": { id: "Total Runtime", tab: "live-status" },
  "DBG Accel Output": { id: "DBG Accel Output", tab: "live-status" },
  "DBG Gyro Output": { id: "DBG Gyro Output", tab: "live-status" },
  "DBG Motor Status 0": { id: "DBG Motor Status 0", tab: "live-status" },
  "DBG Motor Status 1": { id: "DBG Motor Status 1", tab: "live-status" },
  "General Status": { id: "General Status", tab: "live-status" },
  "Time Stamp": { id: "Time Stamp", tab: "live-status" }
};


  // ✅ Handle search with auto tab switch + scroll + highlight
 const handleSearch = () => {
  if (query.trim()) {
    const searchKey = query.toLowerCase().trim();

    // Try exact match (case-insensitive)
    const exactMatch = Object.entries(parameterMap).find(
      ([key]) => key.toLowerCase() === searchKey
    );

    // If no exact match, try partial match
    const found = exactMatch || Object.entries(parameterMap).find(
      ([key]) => key.toLowerCase().includes(searchKey)
    );

    if (found) {
      const { id, tab } = found[1];

      onTabChange(tab);

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.style.outline = "2px solid #3498db";
          setTimeout(() => {
            element.style.outline = "";
          }, 1500);
        }
      }, 400);
    } else {
      alert("Parameter not found!");
    }
  }
};


  // Navigation tabs
  const tabs = [
    { id: 'admin', label: 'Admin', icon: Settings },
    { id: 'live-status', label: 'Live Status', icon: Activity },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <nav className="navigation desktop-nav">
        <div className="nav-header">
          <h2>Solar Plant Monitor</h2>
          <p>Control Dashboard</p>
        </div>

        {/* Search Bar */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search parameter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>
            <Search size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="nav-tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <div
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <IconComponent size={20} />
                <span>{tab.label}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Dropdown for Mobile */}
      <div className="mobile-dropdown">
        <button
          className="dropdown-btn"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          Admin <ChevronDown size={16} />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`dropdown-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  onTabChange(tab.id);
                  setDropdownOpen(false);
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
