import { useState } from 'react';

function TodoForm({ onSubmit, onCancel, initialData = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    due_date: initialData?.due_date || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white border-2 border-primary rounded-lg p-6 mb-5">
      <h2 className="text-primary-dark text-xl mb-5 font-mono font-bold">
        {isEditing ? 'EDIT TASK' : 'NEW TASK'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-text-primary mb-2 font-mono font-bold text-sm">
            Title *
          </label>
          <input
            type="text"
            className="w-full p-3 bg-purple-50 border-2 border-primary rounded-md text-text-primary font-mono focus:outline-none focus:border-primary-dark focus:bg-white transition-all"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-text-primary mb-2 font-mono font-bold text-sm">
            Description
          </label>
          <textarea
            className="w-full p-3 bg-purple-50 border-2 border-primary rounded-md text-text-primary font-mono focus:outline-none focus:border-primary-dark focus:bg-white transition-all resize-none"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="mb-5">
          <label className="block text-text-primary mb-2 font-mono font-bold text-sm">
            Due Date
          </label>
          <input
            type="date"
            className="w-full p-3 bg-purple-50 border-2 border-primary rounded-md text-text-primary font-mono focus:outline-none focus:border-primary-dark focus:bg-white transition-all"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 p-3 bg-gradient-to-r from-primary-dark to-primary border-2 border-primary-dark rounded-md text-white font-mono font-bold uppercase tracking-wide cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {isEditing ? 'UPDATE' : 'CREATE'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 p-3 bg-white border-2 border-gray-400 rounded-md text-gray-600 font-mono font-bold uppercase tracking-wide cursor-pointer transition-all hover:bg-gray-50"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
