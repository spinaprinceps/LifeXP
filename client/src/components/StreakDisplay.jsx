function StreakDisplay({ streak, allCompletedToday }) {
  return (
    <div className="auth-card" style={{ marginBottom: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
        {allCompletedToday ? (
          <span style={{ 
            animation: 'flicker 1.5s infinite alternate',
            filter: 'drop-shadow(0 0 10px orange)'
          }}>
            🔥
          </span>
        ) : (
          <span style={{ opacity: 0.3 }}>🔥</span>
        )}
      </div>
      <p style={{ 
        color: 'var(--purple-neon)', 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        marginBottom: '5px'
      }}>
        {streak} Day Streak
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {allCompletedToday ? 'All habits completed today! 🎉' : 'Complete all habits to maintain streak'}
      </p>
      <style>
        {`
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
}

export default StreakDisplay;
