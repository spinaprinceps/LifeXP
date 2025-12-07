const express = require('express');
const router = express.Router();
const {
  createEntry,
  getUserEntries,
  getEntryById,
  updateEntry,
  deleteEntry
} = require('../controllers/journalController');

// Create a new journal entry
router.post('/', createEntry);

// Get all journal entries for a user
router.get('/user/:user_id', getUserEntries);

// Get a single journal entry by ID
router.get('/:id', getEntryById);

// Update a journal entry
router.put('/:id', updateEntry);

// Delete a journal entry
router.delete('/:id', deleteEntry);

module.exports = router;
