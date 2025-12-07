CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);

-- Create index on created_at for sorting
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
