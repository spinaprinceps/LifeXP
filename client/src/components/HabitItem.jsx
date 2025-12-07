import { useState } from 'react';

function HabitItem({ habit, onComplete, onUncomplete, onEdit, onDelete, isCompleted }) {
  const xpValues = {
    easy: 10,
    medium: 20,
    hard: 30
  };

  return (
    <div className="auth-card" style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: isCompleted ? 'var(--purple-neon)' : 'var(--text-primary)', 
            marginBottom: '5px',
            textDecoration: isCompleted ? 'line-through' : 'none'
          }}>
            {isCompleted && '✓ '}{habit.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {habit.frequency} • {habit.category} • +{xpValues[habit.category]} XP
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isCompleted ? (
            <button
              onClick={() => onComplete(habit.id)}
              style={{
                background: 'linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-dark) 100%)',
                border: '2px solid var(--purple-neon)',
                color: 'var(--text-primary)',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace',
                fontWeight: 'bold'
              }}
            >
              ✓ DONE
            </button>
          ) : (
            <button
              onClick={() => onUncomplete(habit.id)}
              style={{
                background: 'transparent',
                border: '2px solid var(--purple-neon)',
                color: 'var(--text-primary)',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace'
              }}
            >
              UNDO
            </button>
          )}
          <button
            onClick={() => onEdit(habit)}
            style={{
              background: 'transparent',
              border: '2px solid var(--purple-light)',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace'
            }}
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            style={{
              background: 'transparent',
              border: '2px solid crimson',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'Courier New, monospace'
            }}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitItem;
