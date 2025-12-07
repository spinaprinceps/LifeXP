import { useState, useEffect } from 'react';

function MonthlyCalendar({ userId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [streakDays, setStreakDays] = useState([]);

  useEffect(() => {
    loadStreakData();
  }, [currentMonth, userId]);

  const loadStreakData = async () => {
    try {
      // Fetch daily_stats for the current month from backend
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await fetch(`http://localhost:3000/api/habits/monthly-stats/${userId}/${year}/${month}`);
      const data = await response.json();
      
      // Extract days where all habits were completed
      const completedDays = data.stats
        .filter(stat => stat.completed_all)
        .map(stat => new Date(stat.date).getDate());
      
      setStreakDays(completedDays);
    } catch (error) {
      console.error('Error loading streak data:', error);
      setStreakDays([]);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date().getDate();
  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() && 
    currentMonth.getFullYear() === new Date().getFullYear();

  const days = [];
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(
      <div 
        key={`empty-${i}`} 
        style={{ 
          padding: '8px',
          minHeight: '60px'
        }} 
      />
    );
  }
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const hasStreak = streakDays.includes(day);
    const isToday = isCurrentMonth && day === today;
    
    days.push(
      <div
        key={day}
        style={{
          padding: '8px',
          textAlign: 'center',
          position: 'relative',
          color: isToday ? 'var(--purple-dark)' : 'var(--text-primary)',
          fontWeight: isToday ? 'bold' : 'normal',
          border: isToday ? '2px solid var(--purple-dark)' : 'none',
          borderRadius: '5px',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ fontSize: '0.9rem' }}>{day}</div>
        {hasStreak && (
          <div style={{ fontSize: '1.2rem', marginTop: '2px' }}>
            🔥
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-card" style={{ marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          style={{
            background: '#FFFFFF',
            border: '2px solid var(--purple-primary)',
            color: 'var(--purple-dark)',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace'
          }}
        >
          ◀
        </button>
        <h3 style={{ color: 'var(--purple-dark)', fontSize: '1rem' }}>
          {monthName}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          style={{
            background: '#FFFFFF',
            border: '2px solid var(--purple-primary)',
            color: 'var(--purple-dark)',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Courier New, monospace'
          }}
        >
          ▶
        </button>
      </div>

      {/* Day headers */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: '10px'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ 
            textAlign: 'center', 
            color: 'var(--purple-dark)',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            padding: '5px'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px'
      }}>
        {days}
      </div>
    </div>
  );
}

export default MonthlyCalendar;
