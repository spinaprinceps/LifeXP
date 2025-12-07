CREATE TABLE habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create index on habit_id for faster queries
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);

-- Create index on user_id for faster queries
CREATE INDEX idx_habit_logs_user_id ON habit_logs(user_id);

-- Create index on date for faster date-based queries
CREATE INDEX idx_habit_logs_date ON habit_logs(date);

-- Create composite index for common query pattern
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);

-- Ensure one log per habit per day
CREATE UNIQUE INDEX idx_habit_logs_unique ON habit_logs(habit_id, date);
