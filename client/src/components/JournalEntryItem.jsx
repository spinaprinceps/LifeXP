import React from 'react';

function JournalEntryItem({ entry, onView, onEdit, onDelete }) {
  // Format timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleDateString('en-US', options).replace(',', ' •');
  };

  // Get preview text (first 100 characters)
  const getPreview = (text) => {
    if (text.length <= 100) return text;
    return text.substring(0, 100) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
          {getPreview(entry.content)}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {formatDate(entry.created_at)}
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={() => onView(entry)}
            className="px-3 py-1 text-sm bg-primary-light text-white rounded hover:bg-opacity-90 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="px-3 py-1 text-sm bg-peach text-gray-800 rounded hover:bg-opacity-90 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default JournalEntryItem;
