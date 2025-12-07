import { useState, useEffect } from 'react';
import { getUserTodos, createTodo, updateTodo, toggleTodoComplete, deleteTodo, getTodoStats } from '../services/todos';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoStats from './TodoStats';

function TodoSection() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      loadTodos();
      loadStats();
    }
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await getUserTodos(user.id);
      setTodos(data.todos);
    } catch (error) {
      console.error('Error loading todos:', error);
      showMessage('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getTodoStats(user.id);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateTodo = async (formData) => {
    try {
      await createTodo(user.id, formData.title, formData.description, formData.due_date);
      showMessage('✅ Task created successfully!');
      setShowForm(false);
      loadTodos();
      loadStats();
    } catch (error) {
      console.error('Error creating todo:', error);
      showMessage('Failed to create task', 'error');
    }
  };

  const handleUpdateTodo = async (formData) => {
    try {
      await updateTodo(editingTodo.id, user.id, formData.title, formData.description, formData.due_date);
      showMessage('✅ Task updated successfully!');
      setEditingTodo(null);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      showMessage('Failed to update task', 'error');
    }
  };

  const handleToggleComplete = async (todoId) => {
    try {
      await toggleTodoComplete(todoId, user.id);
      loadTodos();
      loadStats();
    } catch (error) {
      console.error('Error toggling todo:', error);
      showMessage('Failed to update task', 'error');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTodo(todoId, user.id);
      showMessage('🗑️ Task deleted successfully!');
      loadTodos();
      loadStats();
    } catch (error) {
      console.error('Error deleting todo:', error);
      showMessage('Failed to delete task', 'error');
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="text-primary-dark text-xl font-mono">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add Task Button */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl text-primary-dark font-bold font-mono flex items-center gap-2">
          <span className="text-4xl">📋</span>
          MY TASKS
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-primary-dark to-primary border-2 border-primary-dark rounded-md text-white font-mono font-bold uppercase tracking-wide cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          {showForm ? '✕ CANCEL' : '+ ADD TASK'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-5 p-4 rounded-lg font-mono font-bold text-center ${
          message.type === 'error' 
            ? 'bg-red-100 text-red-600 border-2 border-red-300' 
            : 'bg-green-100 text-green-600 border-2 border-green-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <TodoStats stats={stats} />

      {/* Form */}
      {showForm && (
        <TodoForm
          onSubmit={handleCreateTodo}
          onCancel={handleCancelForm}
        />
      )}

      {/* Edit Form */}
      {editingTodo && (
        <TodoForm
          onSubmit={handleUpdateTodo}
          onCancel={handleCancelForm}
          initialData={editingTodo}
          isEditing={true}
        />
      )}

      {/* Todo List */}
      <TodoList
        todos={todos}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditClick}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}

export default TodoSection;
