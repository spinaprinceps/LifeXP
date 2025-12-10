const supabase = require('../config/database');

// Create a new journal entry
const createEntry = async (req, res) => {
  const { user_id, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{ user_id, content }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
};

// Get all journal entries for a user (sorted by newest first)
const getUserEntries = async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

// Get a single journal entry by ID
const getEntryById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
};

// Update a journal entry
const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
};

// Delete a journal entry
const deleteEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully', entry: data });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
};

module.exports = {
  createEntry,
  getUserEntries,
  getEntryById,
  updateEntry,
  deleteEntry
};
