function ProgressBar({ currentXp, nextLevelXp, level }) {
  const progress = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 0;
  const clampedProgress = Math.min(progress, 100);

  return (
    <div className="auth-card" style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--purple-neon)', fontWeight: 'bold' }}>
          LEVEL {level}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          {currentXp} / {nextLevelXp} XP
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '30px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '2px solid var(--purple-primary)',
        borderRadius: '15px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${clampedProgress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--purple-primary) 0%, var(--purple-neon) 100%)',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 15px var(--purple-neon)'
        }} />
      </div>
    </div>
  );
}

export default ProgressBar;
