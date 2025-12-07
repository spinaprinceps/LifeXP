import React, { useState, useEffect } from 'react';
import JournalEntryForm from './JournalEntryForm';
import JournalEntryItem from './JournalEntryItem';
import JournalEntryView from './JournalEntryView';
import * as journalService from '../services/journal';

function JournalSection() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        const data = await journalService.getUserEntries(user.id);
        setEntries(data);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
      showMessage('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateEntry = async (content) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await journalService.createEntry(user.id, content);
      showMessage('Journal entry created successfully!');
      setShowForm(false);
      loadEntries();
    } catch (error) {
      console.error('Error creating journal entry:', error);
      showMessage('Failed to create journal entry');
    }
  };

  const handleUpdateEntry = async (content) => {
    try {
      await journalService.updateEntry(editingEntry.id, content);
      showMessage('Journal entry updated successfully!');
      setShowForm(false);
      setEditingEntry(null);
      loadEntries();
    } catch (error) {
      console.error('Error updating journal entry:', error);
      showMessage('Failed to update journal entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await journalService.deleteEntry(id);
        showMessage('Journal entry deleted successfully!');
        loadEntries();
      } catch (error) {
        console.error('Error deleting journal entry:', error);
        showMessage('Failed to delete journal entry');
      }
    }
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowView(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">Journal</h2>
          <p className="text-gray-600 mt-1">Reflect on your journey</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          New Entry
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
          {message}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading journal entries...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-4">No journal entries yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Write your first entry
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <JournalEntryItem
              key={entry.id}
              entry={entry}
              onView={handleViewEntry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <JournalEntryForm
          onSave={editingEntry ? handleUpdateEntry : handleCreateEntry}
          onCancel={handleCancelForm}
          initialContent={editingEntry ? editingEntry.content : ''}
        />
      )}

      {showView && selectedEntry && (
        <JournalEntryView
          entry={selectedEntry}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
          onClose={() => {
            setShowView(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
}

export default JournalSection;
