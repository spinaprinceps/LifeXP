import { useState } from 'react';

function StatsButtons() {
  const [selectedView, setSelectedView] = useState(null);

  const showWeeklyStats = () => {
    setSelectedView('weekly');
    alert('Weekly stats view - Coming soon!');
  };

  const showDailyStats = () => {
    setSelectedView('daily');
    alert('Daily stats view - Coming soon!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        onClick={showWeeklyStats}
        className="btn-primary"
        style={{ 
          width: '100%',
          background: selectedView === 'weekly' 
            ? 'linear-gradient(135deg, var(--purple-neon) 0%, var(--purple-primary) 100%)'
            : 'linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-dark) 100%)'
        }}
      >
        📊 WEEKLY STATS
      </button>
      <button
        onClick={showDailyStats}
        className="btn-primary"
        style={{ 
          width: '100%',
          background: selectedView === 'daily' 
            ? 'linear-gradient(135deg, var(--purple-neon) 0%, var(--purple-primary) 100%)'
            : 'linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-dark) 100%)'
        }}
      >
        📈 DAILY STATS
      </button>
    </div>
  );
}

export default StatsButtons;
