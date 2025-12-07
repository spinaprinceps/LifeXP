function Navbar({ onLogout }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '2px solid var(--purple-primary)',
      borderRadius: '10px',
      padding: '15px 30px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 15px rgba(105, 111, 199, 0.15)'
    }}>
      <h1 style={{
        color: 'var(--purple-dark)',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        letterSpacing: '3px',
        margin: 0
      }}>
        LIFEXP
      </h1>
      
      <button 
        onClick={onLogout} 
        style={{ 
          background: 'var(--purple-dark)', 
          border: '2px solid var(--purple-dark)', 
          color: '#FFFFFF',
          padding: '10px 25px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontFamily: 'Courier New, monospace',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--purple-primary)';
          e.target.style.borderColor = 'var(--purple-primary)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--purple-dark)';
          e.target.style.borderColor = 'var(--purple-dark)';
        }}
      >
        LOGOUT
      </button>
    </div>
  );
}

export default Navbar;
