import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import AdminPanel from './components/AdminPanel';
import LiveStatus from './components/LiveStatus';
import Reports from './components/Reports';
import Alerts from './components/Alerts';
import StatusBar from './components/StatusBar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('admin');
  const [appState, setAppState] = useState({
    city: null,
    zone: null
  });

  // Dynamic bottom margin for content
  const [bottomMargin, setBottomMargin] = useState(80); // Default
  const statusBarRef = useRef<HTMLDivElement>(null);

  // Update margin based on StatusBar height
  useEffect(() => {
    const updateMargin = () => {
      if (statusBarRef.current) {
        const height = statusBarRef.current.offsetHeight;
        setBottomMargin(height + 20); // Extra 20px spacing
      }
    };

    updateMargin(); // Initial
    window.addEventListener('resize', updateMargin);

    return () => {
      window.removeEventListener('resize', updateMargin);
    };
  }, []);

  // Update city & zone from Admin Panel
  const updateCityZone = (city: string, zone: string) => {
    setAppState({ city, zone });
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminPanel onCityZoneUpdate={updateCityZone} />;
      case 'live-status':
        return <LiveStatus cityZone={appState} />;
      case 'reports':
        return <Reports />;
      case 'alerts':
        return <Alerts />;
      default:
        return <AdminPanel onCityZoneUpdate={updateCityZone} />;
    }
  };

  return (
    <div className="app-container">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main
        className="main-content"
        style={{ marginBottom: `${10}px` }}
      >
        {renderContent()}
      </main>
      <div ref={statusBarRef}>
        <StatusBar />
      </div>
    </div>
  );
}

export default App;
