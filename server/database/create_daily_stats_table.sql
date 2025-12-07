CREATE TABLE daily_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  completed_all BOOLEAN DEFAULT FALSE,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX idx_daily_stats_user_id ON daily_stats(user_id);

-- Create index on date for faster date-based queries
CREATE INDEX idx_daily_stats_date ON daily_stats(date);

-- Create composite index for common query pattern
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, date);

-- Ensure one stats entry per user per day
CREATE UNIQUE INDEX idx_daily_stats_unique ON daily_stats(user_id, date);
