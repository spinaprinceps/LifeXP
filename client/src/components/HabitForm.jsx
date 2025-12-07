function HabitForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  return (
    <div className="auth-card" style={{ marginBottom: '20px' }}>
      <h2 style={{ color: 'var(--purple-neon)', marginBottom: '20px' }}>
        {isEditing ? 'EDIT HABIT' : 'CREATE HABIT'}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Habit Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Frequency</label>
          <select
            className="form-input"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Difficulty</label>
          <select
            className="form-input"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="easy">Easy (10 XP)</option>
            <option value="medium">Medium (20 XP)</option>
            <option value="hard">Hard (30 XP)</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary">
            {isEditing ? 'UPDATE' : 'CREATE'}
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ background: 'transparent' }}
            onClick={onCancel}
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

export default HabitForm;
