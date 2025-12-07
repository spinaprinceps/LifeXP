import { useState } from 'react';

function ProfileSection({ user, stats }) {
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || null);

  const handlePhotoClick = () => {
    setShowPhotoMenu(!showPhotoMenu);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoData = event.target.result;
          setProfilePhoto(photoData);
          localStorage.setItem('profilePhoto', photoData);
          setShowPhotoMenu(false);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDelete = () => {
    setProfilePhoto(null);
    localStorage.removeItem('profilePhoto');
    setShowPhotoMenu(false);
  };

  return (
    <div className="auth-card" style={{ marginBottom: '20px', textAlign: 'center' }}>
      {/* Profile Photo */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
        <div
          onClick={handlePhotoClick}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '3px solid var(--purple-dark)',
            background: profilePhoto 
              ? `url(${profilePhoto}) center/cover` 
              : 'linear-gradient(135deg, var(--purple-dark), var(--purple-primary))',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#FFFFFF',
            boxShadow: '0 4px 15px rgba(105, 111, 199, 0.2)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {!profilePhoto && '👤'}
        </div>
        
        {showPhotoMenu && (
          <div style={{
            position: 'absolute',
            top: '130px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFFFFF',
            border: '2px solid var(--purple-primary)',
            borderRadius: '5px',
            padding: '10px',
            zIndex: 10,
            minWidth: '150px'
          }}>
            <button
              onClick={handleUpload}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '5px',
                background: 'var(--purple-dark)',
                border: 'none',
                borderRadius: '3px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace'
              }}
            >
              UPLOAD
            </button>
            {profilePhoto && (
              <button
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#FFFFFF',
                  border: '2px solid #dc3545',
                  borderRadius: '3px',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace'
                }}
              >
                DELETE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Username */}
      <h2 style={{ color: 'var(--purple-dark)', marginBottom: '10px', fontSize: '1.5rem' }}>
        {user.name}
      </h2>

      {/* Current Level */}
      <div style={{ 
        marginBottom: '15px',
        padding: '10px 20px',
        background: 'rgba(105, 111, 199, 0.1)',
        border: '2px solid var(--purple-primary)',
        borderRadius: '8px'
      }}>
        <p style={{ 
          color: 'var(--purple-dark)', 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          margin: 0
        }}>
          LEVEL {stats?.level || 0}
        </p>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        {user.email}
      </p>
    </div>
  );
}

export default ProfileSection;
