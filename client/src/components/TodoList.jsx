import TodoItem from './TodoItem';

function TodoList({ todos, onToggleComplete, onEdit, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="bg-white border-2 border-primary rounded-lg p-8 text-center">
        <p className="text-gray-500 font-mono text-lg">📝 No tasks yet. Create your first task!</p>
      </div>
    );
  }

  // Separate todos by completion status
  const pendingTodos = todos.filter(t => !t.is_completed);
  const completedTodos = todos.filter(t => t.is_completed);

  return (
    <div>
      {pendingTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-primary-dark text-xl mb-4 font-mono font-bold flex items-center gap-2">
            <span className="text-2xl">📌</span>
            PENDING TASKS ({pendingTodos.length})
          </h2>
          {pendingTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-gray-500 text-xl mb-4 font-mono font-bold flex items-center gap-2">
            <span className="text-2xl">✅</span>
            COMPLETED ({completedTodos.length})
          </h2>
          {completedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
