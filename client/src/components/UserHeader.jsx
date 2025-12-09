function UserHeader({ user, stats, onLogout }) {
  return (
    <div className="auth-card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="auth-title" style={{ marginBottom: '5px', fontSize: '2rem' }}>
            LIFEXP
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user.username}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ 
            color: 'var(--purple-neon)', 
            fontSize: '1.8rem', 
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            Level {stats?.level || 0}
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
            {user.xp || 0} XP
          </p>
          <button 
            onClick={onLogout} 
            style={{ 
              background: 'transparent', 
              border: '2px solid var(--purple-primary)', 
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace',
              marginTop: '10px'
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
