import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Zap, Shield, Battery } from 'lucide-react';
import './Alerts.css';

const Alerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      title: 'Maintenance Needs',
      status: 'pending',
      description: 'Scheduled maintenance required',
      lastUpdate: '2025-08-15',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Rain Sensor',
      status: 'active',
      description: 'Rain detection system operational',
      lastUpdate: '2025-07-19 14:30',
      icon: CheckCircle,
      priority: 'normal'
    },
    {
      id: 3,
      title: 'Position Sensors',
      status: 'normal',
      description: 'All position sensors calibrated',
      lastUpdate: '2025-06-30',
      icon: CheckCircle,
      priority: 'normal'
    },
    {
      id: 4,
      title: 'Over Heat Protection',
      status: 'triggered',
      description: 'Temperature threshold exceeded',
      lastUpdate: '2025-07-18 11:20',
      icon: Zap,
      priority: 'critical'
    },
    {
      id: 5,
      title: 'Over Current Protection',
      status: 'normal',
      description: 'Current levels within safe limits',
      lastUpdate: 'No recent events',
      icon: Shield,
      priority: 'normal'
    },
    {
      id: 6,
      title: 'Deep Discharge Protection',
      status: 'normal',
      description: 'Battery voltage stable',
      lastUpdate: 'Monitoring continuous',
      icon: Battery,
      priority: 'normal'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#27ae60';
      case 'active': return '#3498db';
      case 'pending': return '#f39c12';
      case 'triggered': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#e74c3c';
      case 'high': return '#e67e22';
      case 'normal': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="alerts fade-in">
      <h2>System Alerts</h2>
      <p>Monitor protection systems and maintenance requirements for optimal performance.</p>

      <div className="alerts-summary">
        <div className="summary-item critical">
          <div className="summary-number">1</div>
          <div className="summary-label">Critical</div>
        </div>
        <div className="summary-item high">
          <div className="summary-number">1</div>
          <div className="summary-label">High Priority</div>
        </div>
        <div className="summary-item normal">
          <div className="summary-number">4</div>
          <div className="summary-label">Normal</div>
        </div>
      </div>

      <div className="alerts-grid">
        {alerts.map(alert => {
          const IconComponent = alert.icon;
          return (
            <div key={alert.id} className="alert-card">
              <div className="alert-header">
                <div className="alert-icon" style={{ color: getStatusColor(alert.status) }}>
                  <IconComponent size={24} />
                </div>
                <div className="alert-priority" style={{ backgroundColor: getPriorityColor(alert.priority) }}>
                  {alert.priority}
                </div>
              </div>
              
              <div className="alert-content">
                <h3>{alert.title}</h3>
                <p>{alert.description}</p>
                
                <div className="alert-details">
                  <div className="alert-status">
                    <span className="status-label">Status:</span>
                    <span 
                      className="status-value"
                      style={{ color: getStatusColor(alert.status) }}
                    >
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="alert-timestamp">
                    <span className="timestamp-label">Last Update:</span>
                    <span className="timestamp-value">{alert.lastUpdate}</span>
                  </div>
                </div>
              </div>

              <div className="alert-actions">
                {alert.status === 'triggered' || alert.status === 'pending' ? (
                  <>
                    <button className="btn btn-primary">Acknowledge</button>
                    <button className="btn btn-secondary">View Details</button>
                  </>
                ) : (
                  <button className="btn btn-secondary">View Details</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="alerts-history">
        <h3>Recent Alert History</h3>
        <div className="history-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Alert Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-07-19 14:30</td>
                <td>Rain Sensor</td>
                <td><span className="priority-badge normal">Normal</span></td>
                <td><span className="status-badge active">Active</span></td>
                <td>Rain detection activated</td>
                <td><button className="btn-small">View</button></td>
              </tr>
              <tr>
                <td>2025-07-18 11:20</td>
                <td>Over Heat Protection</td>
                <td><span className="priority-badge critical">Critical</span></td>
                <td><span className="status-badge triggered">Triggered</span></td>
                <td>Temperature exceeded 45°C</td>
                <td><button className="btn-small">View</button></td>
              </tr>
              <tr>
                <td>2025-07-15 09:15</td>
                <td>Maintenance</td>
                <td><span className="priority-badge high">High</span></td>
                <td><span className="status-badge resolved">Resolved</span></td>
                <td>Scheduled maintenance completed</td>
                <td><button className="btn-small">View</button></td>
              </tr>
              <tr>
                <td>2025-07-10 16:45</td>
                <td>Position Sensors</td>
                <td><span className="priority-badge normal">Normal</span></td>
                <td><span className="status-badge normal">Normal</span></td>
                <td>Calibration completed successfully</td>
                <td><button className="btn-small">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;