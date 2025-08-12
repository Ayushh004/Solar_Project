import React from 'react';
import './StatusBar.css';

const StatusBar: React.FC = () => {
  const statusItems = [
    { label: 'Maintenance Needs', status: 'warning', tooltip: 'Maintenance scheduled for next week' },
    { label: 'Rain Sensor', status: 'active', tooltip: 'Rain sensor is operational' },
    { label: 'Position Sensors', status: 'normal', tooltip: 'All position sensors calibrated' },
    { label: 'Over Heat Protection', status: 'critical', tooltip: 'Temperature threshold exceeded' },
    { label: 'Over Current Protection', status: 'normal', tooltip: 'Current levels within safe limits' },
    { label: 'Deep Discharge Protection', status: 'normal', tooltip: 'Battery voltage stable' }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'critical': return 'status-critical';
      case 'warning': return 'status-warning';
      case 'active': return 'status-active';
      case 'normal': return 'status-normal';
      default: return 'status-normal';
    }
  };

  return (
    <div className="status-bar">
      <div className="status-items">
        {statusItems.map((item, index) => (
          <div
            key={index}
            className={`status-item ${getStatusClass(item.status)}`}
            title={item.tooltip}
          >
            <div className="status-indicator"></div>
            <span className="status-text">{item.label}</span>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default StatusBar;