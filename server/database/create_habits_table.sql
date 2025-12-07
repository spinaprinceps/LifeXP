CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('easy', 'medium', 'hard')),
  frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX idx_habits_user_id ON habits(user_id);

-- Create index on category for filtering
CREATE INDEX idx_habits_category ON habits(category);
