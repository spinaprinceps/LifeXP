function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
  const isOverdue = todo.is_overdue;
  const isCompleted = todo.is_completed;

  const getDueDateInfo = (dateString) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: 'OVERDUE', color: 'bg-red-100 text-red-600 border-red-300' };
    } else if (diffDays === 0) {
      return { label: 'DUE TODAY', color: 'bg-orange-100 text-orange-600 border-orange-300' };
    } else if (diffDays === 1) {
      return { label: 'DUE TOMORROW', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    } else if (diffDays <= 3) {
      return { label: `DUE IN ${diffDays} DAYS`, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    } else {
      return { label: `DUE IN ${diffDays} DAYS`, color: 'bg-green-100 text-green-600 border-green-300' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const dueDateInfo = !isCompleted && todo.due_date ? getDueDateInfo(todo.due_date) : null;

  return (
    <div className={`bg-white border-2 border-primary rounded-lg p-4 mb-3 transition-all hover:shadow-md ${
      isCompleted ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(todo.id)}
          className="mt-1 flex-shrink-0"
        >
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
            isCompleted 
              ? 'bg-primary-dark border-primary-dark scale-110' 
              : 'bg-white border-primary hover:border-primary-dark hover:scale-105'
          }`}>
            {isCompleted && <span className="text-white text-sm font-bold">✓</span>}
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-bold font-mono mb-1 transition-all duration-300 ${
            isCompleted ? 'line-through text-gray-400' : 'text-text-primary'
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`text-sm font-mono mb-2 transition-all duration-300 ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {todo.due_date && (
              <span className={`text-xs font-mono px-2 py-1 rounded ${
                isCompleted
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-blue-50 text-blue-600'
              }`}>
                📅 {formatDate(todo.due_date)}
              </span>
            )}
            
            {dueDateInfo && !isCompleted && (
              <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${dueDateInfo.color}`}>
                {dueDateInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isCompleted && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(todo)}
              className="px-3 py-1.5 bg-white border-2 border-primary text-primary-dark rounded font-mono text-sm font-bold hover:bg-primary-light transition-colors"
            >
              EDIT
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1.5 bg-white border-2 border-red-500 text-red-500 rounded font-mono text-sm font-bold hover:bg-red-50 transition-colors"
            >
              DELETE
            </button>
          </div>
        )}
        
        {isCompleted && (
          <button
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1.5 bg-white border-2 border-gray-400 text-gray-500 rounded font-mono text-sm font-bold hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            DELETE
          </button>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
