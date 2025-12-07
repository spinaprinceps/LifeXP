import HabitItem from './HabitItem';

function HabitList({ habits, completedHabitIds, onComplete, onUncomplete, onEdit, onDelete }) {
  return (
    <div>
      <h2 style={{ 
        color: 'var(--purple-dark)', 
        marginBottom: '15px', 
        fontSize: '1.5rem' 
      }}>
        TODAY'S HABITS
      </h2>
      {habits.length === 0 ? (
        <div className="auth-card">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No habits yet. Create your first habit!
          </p>
        </div>
      ) : (
        habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onComplete={onComplete}
            onUncomplete={onUncomplete}
            onEdit={onEdit}
            onDelete={onDelete}
            isCompleted={completedHabitIds.includes(habit.id)}
          />
        ))
      )}
    </div>
  );
}

export default HabitList;
