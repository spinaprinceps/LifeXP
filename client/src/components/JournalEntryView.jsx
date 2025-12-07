import React from 'react';

function JournalEntryView({ entry, onEdit, onDelete, onClose }) {
  // Format timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark mb-2">Journal Entry</h2>
              <p className="text-sm text-gray-500">{formatDate(entry.created_at)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-tan bg-opacity-20 rounded-lg p-6 min-h-[200px]">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(entry);
                onClose();
              }}
              className="px-6 py-2 bg-peach text-gray-800 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(entry.id);
                onClose();
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalEntryView;
